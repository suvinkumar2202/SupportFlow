package com.supportflow.dto;

public class FeedbackRequest {
    private String subject;
    private String description;
    private String category;
    private Integer rating;
    private Long ticketId;

    public FeedbackRequest() {
    }

    public FeedbackRequest(String subject, String description, String category, Integer rating, Long ticketId) {
        this.subject = subject;
        this.description = description;
        this.category = category;
        this.rating = rating;
        this.ticketId = ticketId;
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

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }
}
