package com.supportflow.controller;

import com.supportflow.dto.ApiResponse;
import com.supportflow.dto.TicketRequest;
import com.supportflow.dto.TicketResponse;
import com.supportflow.dto.TicketUpdateRequest;
import com.supportflow.model.entity.Role;
import com.supportflow.model.entity.Ticket;
import com.supportflow.model.entity.User;
import com.supportflow.model.enums.TicketPriority;
import com.supportflow.model.enums.TicketStatus;
import jakarta.persistence.EntityNotFoundException;
import com.supportflow.repository.TicketRepository;
import com.supportflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
@Transactional
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private TicketResponse toResponse(Ticket ticket) {
        String assignedToName = null;
        Long assignedToId = null;
        if (ticket.getAssignedTo() != null) {
            assignedToId = ticket.getAssignedTo().getId();
            assignedToName = ticket.getAssignedTo().getName();
        }
        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getPriority().name(),
                ticket.getStatus().name(),
                ticket.getCustomer().getId(),
                ticket.getCustomer().getName(),
                assignedToId,
                assignedToName,
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                ticket.getResolvedAt()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getTickets(
            Authentication authentication,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority) {
        User user = getCurrentUser(authentication);
        List<Ticket> tickets;

        if (user.getRole() == Role.ADMIN) {
            tickets = ticketRepository.findAll();
        } else if (user.getRole() == Role.SUPPORT_AGENT) {
            if (status != null) {
                tickets = ticketRepository.findByAssignedToIdAndStatusOrderByCreatedAtDesc(user.getId(), TicketStatus.valueOf(status.toUpperCase()));
            } else {
                tickets = ticketRepository.findByAssignedToIdOrderByCreatedAtDesc(user.getId());
            }
        } else {
            if (status != null) {
                tickets = ticketRepository.findByCustomerIdAndStatusOrderByCreatedAtDesc(user.getId(), TicketStatus.valueOf(status.toUpperCase()));
            } else {
                tickets = ticketRepository.findByCustomerIdOrderByCreatedAtDesc(user.getId());
            }
        }

        if (priority != null) {
            TicketPriority prio = TicketPriority.valueOf(priority.toUpperCase());
            tickets = tickets.stream()
                    .filter(t -> t.getPriority() == prio)
                    .collect(Collectors.toList());
        }

        List<TicketResponse> responses = tickets.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(responses, "Tickets retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(
            Authentication authentication,
            @RequestBody TicketRequest request) {
        User user = getCurrentUser(authentication);

        User assignedTo = null;
        if (request.getAssignedToId() != null && user.getRole() == Role.ADMIN) {
            assignedTo = userRepository.findById(request.getAssignedToId())
.orElseThrow(() -> new EntityNotFoundException("Agent not found"));
            if (assignedTo.getRole() != Role.SUPPORT_AGENT) {
                return ResponseEntity.badRequest().body(ApiResponse.failure("Assigned user must be a support agent"));
            }
        }

        TicketPriority priority = request.getPriority() != null ? request.getPriority() : TicketPriority.MEDIUM;
        Ticket ticket = new Ticket(user, request.getTitle(), request.getDescription(), priority);
        ticket.setAssignedTo(assignedTo);

        Ticket saved = ticketRepository.save(ticket);
        return ResponseEntity.ok(ApiResponse.success(toResponse(saved), "Ticket created successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicket(
            Authentication authentication,
            @PathVariable Long id) {
        User user = getCurrentUser(authentication);
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found"));

        boolean canView = user.getRole() == Role.ADMIN
                || (user.getRole() == Role.SUPPORT_AGENT && ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(user.getId()))
                || ticket.getCustomer().getId().equals(user.getId());

        if (!canView) {
            return ResponseEntity.status(403).body(ApiResponse.failure("You do not have permission to view this ticket"));
        }

        return ResponseEntity.ok(ApiResponse.success(toResponse(ticket), "Ticket retrieved"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TicketResponse>> updateStatus(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody TicketUpdateRequest request) {
        User user = getCurrentUser(authentication);
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found"));

        boolean canUpdate = user.getRole() == Role.ADMIN
                || (user.getRole() == Role.SUPPORT_AGENT && ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(user.getId()));

        if (!canUpdate) {
            return ResponseEntity.status(403).body(ApiResponse.failure("You do not have permission to update this ticket"));
        }

        if (request.getStatus() != null) {
            ticket.setStatus(TicketStatus.valueOf(request.getStatus().toUpperCase()));
        }

        Ticket saved = ticketRepository.save(ticket);
        return ResponseEntity.ok(ApiResponse.success(toResponse(saved), "Ticket updated successfully"));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TicketResponse>> assignAgent(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody TicketUpdateRequest request) {
        if (request.getAssignedToId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Agent ID is required"));
        }

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found"));

        User agent = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        if (agent.getRole() != Role.SUPPORT_AGENT) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("User must be a support agent"));
        }

        ticket.setAssignedTo(agent);
        Ticket saved = ticketRepository.save(ticket);
        return ResponseEntity.ok(ApiResponse.success(toResponse(saved), "Agent assigned successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTicket(
            Authentication authentication,
            @PathVariable Long id) {
        User user = getCurrentUser(authentication);
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found"));

        boolean canDelete = user.getRole() == Role.ADMIN
                || ticket.getCustomer().getId().equals(user.getId());

        if (!canDelete) {
            return ResponseEntity.status(403).body(ApiResponse.failure("You do not have permission to delete this ticket"));
        }

        ticketRepository.delete(ticket);
        return ResponseEntity.ok(ApiResponse.success(null, "Ticket deleted successfully"));
    }
}
