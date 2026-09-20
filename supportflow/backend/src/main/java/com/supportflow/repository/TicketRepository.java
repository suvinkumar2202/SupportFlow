package com.supportflow.repository;

import com.supportflow.model.entity.Ticket;
import com.supportflow.model.enums.TicketStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @EntityGraph(attributePaths = {"customer", "assignedTo"})
    List<Ticket> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    @EntityGraph(attributePaths = {"customer", "assignedTo"})
    List<Ticket> findByCustomerIdAndStatusOrderByCreatedAtDesc(Long customerId, TicketStatus status);

    @EntityGraph(attributePaths = {"customer", "assignedTo"})
    List<Ticket> findByAssignedToIdOrderByCreatedAtDesc(Long agentId);

    @EntityGraph(attributePaths = {"customer", "assignedTo"})
    List<Ticket> findByAssignedToIdAndStatusOrderByCreatedAtDesc(Long agentId, TicketStatus status);

    @EntityGraph(attributePaths = {"customer", "assignedTo"})
    @Query("SELECT t FROM Ticket t ORDER BY t.createdAt DESC")
    @Override
    List<Ticket> findAll();
}
