package com.supportflow.dto;

import java.time.LocalDateTime;

public class FeedbackResponse {
    private Long id;
    private String subject;
    private String description;
    private String category;
    private Integer rating;
    private String status;
    private Long userId;
    private String userName;
    private Long ticketId;
    private String ticketTitle;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public FeedbackResponse() {
    }

    public FeedbackResponse(Long id, String subject, String description, String category, Integer rating,
                            String status, Long userId, String userName, Long ticketId, String ticketTitle,
                            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.category = category;
        this.rating = rating;
        this.status = status;
        this.userId = userId;
        this.userName = userName;
        this.ticketId = ticketId;
        this.ticketTitle = ticketTitle;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public String getTicketTitle() {
        return ticketTitle;
    }

    public void setTicketTitle(String ticketTitle) {
        this.ticketTitle = ticketTitle;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
