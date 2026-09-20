package com.supportflow.dto;

import com.supportflow.model.enums.TicketPriority;

public class TicketRequest {
    private String title;
    private String description;
    private TicketPriority priority;
    private Long assignedToId;

    public TicketRequest() {
    }

    public TicketRequest(String title, String description, TicketPriority priority, Long assignedToId) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.assignedToId = assignedToId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public Long getAssignedToId() {
        return assignedToId;
    }

    public void setAssignedToId(Long assignedToId) {
        this.assignedToId = assignedToId;
    }
}
