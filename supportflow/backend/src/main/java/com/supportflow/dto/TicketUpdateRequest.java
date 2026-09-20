package com.supportflow.dto;

public class TicketUpdateRequest {
    private String status;
    private Long assignedToId;

    public TicketUpdateRequest() {
    }

    public TicketUpdateRequest(String status, Long assignedToId) {
        this.status = status;
        this.assignedToId = assignedToId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getAssignedToId() {
        return assignedToId;
    }

    public void setAssignedToId(Long assignedToId) {
        this.assignedToId = assignedToId;
    }
}
