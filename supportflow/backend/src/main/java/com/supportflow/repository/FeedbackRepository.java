package com.supportflow.repository;

import com.supportflow.model.entity.Feedback;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    @EntityGraph(attributePaths = {"user", "ticket"})
    List<Feedback> findByUserIdOrderByCreatedAtDesc(Long userId);
}
