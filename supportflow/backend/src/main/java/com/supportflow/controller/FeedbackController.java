package com.supportflow.controller;

import com.supportflow.dto.ApiResponse;
import com.supportflow.dto.FeedbackRequest;
import com.supportflow.dto.FeedbackResponse;
import com.supportflow.dto.TicketUpdateRequest;
import com.supportflow.model.entity.Feedback;
import com.supportflow.model.entity.Role;
import com.supportflow.model.entity.Ticket;
import com.supportflow.model.entity.User;
import com.supportflow.model.enums.FeedbackStatus;
import jakarta.persistence.EntityNotFoundException;
import com.supportflow.repository.FeedbackRepository;
import com.supportflow.repository.TicketRepository;
import com.supportflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/feedback")
@Transactional
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketRepository ticketRepository;

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private FeedbackResponse toResponse(Feedback feedback) {
        String ticketTitle = null;
        Long ticketId = null;
        if (feedback.getTicket() != null) {
            ticketId = feedback.getTicket().getId();
            ticketTitle = feedback.getTicket().getTitle();
        }
        return new FeedbackResponse(
                feedback.getId(),
                feedback.getSubject(),
                feedback.getDescription(),
                feedback.getCategory(),
                feedback.getRating(),
                feedback.getStatus().name(),
                feedback.getUser().getId(),
                feedback.getUser().getName(),
                ticketId,
                ticketTitle,
                feedback.getCreatedAt(),
                feedback.getUpdatedAt()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FeedbackResponse>>> getFeedback(
            Authentication authentication,
            @RequestParam(required = false) String category) {
        User user = getCurrentUser(authentication);
        List<Feedback> feedback;

        if (user.getRole() == Role.ADMIN || user.getRole() == Role.SUPPORT_AGENT) {
            feedback = feedbackRepository.findAll().stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .collect(Collectors.toList());
        } else {
            feedback = feedbackRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }

        if (category != null) {
            feedback = feedback.stream()
                    .filter(f -> f.getCategory() != null && f.getCategory().equalsIgnoreCase(category))
                    .collect(Collectors.toList());
        }

        List<FeedbackResponse> responses = feedback.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(responses, "Feedback retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FeedbackResponse>> createFeedback(
            Authentication authentication,
            @RequestBody FeedbackRequest request) {
        if (request.getSubject() == null || request.getSubject().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Subject is required"));
        }
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Description is required"));
        }

        User user = getCurrentUser(authentication);

        Ticket ticket = null;
        if (request.getTicketId() != null) {
            ticket = ticketRepository.findById(request.getTicketId())
                    .orElseThrow(() -> new EntityNotFoundException("Ticket not found"));
        }

        Feedback feedback = new Feedback(
                user,
                ticket,
                request.getSubject().trim(),
                request.getDescription().trim(),
                request.getCategory(),
                request.getRating()
        );

        Feedback saved = feedbackRepository.save(feedback);
        return ResponseEntity.ok(ApiResponse.success(toResponse(saved), "Feedback submitted successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FeedbackResponse>> getFeedback(
            Authentication authentication,
            @PathVariable Long id) {
        User user = getCurrentUser(authentication);
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Feedback not found"));

        boolean canView = user.getRole() == Role.ADMIN || user.getRole() == Role.SUPPORT_AGENT
                || feedback.getUser().getId().equals(user.getId());

        if (!canView) {
            return ResponseEntity.status(403).body(ApiResponse.failure("You do not have permission to view this feedback"));
        }

        return ResponseEntity.ok(ApiResponse.success(toResponse(feedback), "Feedback retrieved"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<FeedbackResponse>> updateStatus(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody TicketUpdateRequest request) {
        User user = getCurrentUser(authentication);
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Feedback not found"));

        boolean canUpdate = user.getRole() == Role.ADMIN || user.getRole() == Role.SUPPORT_AGENT;

        if (!canUpdate) {
            return ResponseEntity.status(403).body(ApiResponse.failure("You do not have permission to update this feedback"));
        }

        if (request.getStatus() != null) {
            feedback.setStatus(FeedbackStatus.valueOf(request.getStatus().toUpperCase()));
        }

        Feedback saved = feedbackRepository.save(feedback);
        return ResponseEntity.ok(ApiResponse.success(toResponse(saved), "Feedback updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFeedback(
            Authentication authentication,
            @PathVariable Long id) {
        User user = getCurrentUser(authentication);
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Feedback not found"));

        boolean canDelete = user.getRole() == Role.ADMIN
                || feedback.getUser().getId().equals(user.getId());

        if (!canDelete) {
            return ResponseEntity.status(403).body(ApiResponse.failure("You do not have permission to delete this feedback"));
        }

        feedbackRepository.delete(feedback);
        return ResponseEntity.ok(ApiResponse.success(null, "Feedback deleted successfully"));
    }
}
