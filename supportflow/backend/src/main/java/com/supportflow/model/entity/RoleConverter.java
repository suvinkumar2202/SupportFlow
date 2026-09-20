package com.supportflow.model.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoleConverter implements AttributeConverter<Role, String> {

    @Override
    public String convertToDatabaseColumn(Role role) {
        if (role == null) {
            return null;
        }
        switch (role) {
            case CUSTOMER:
                return "customer";
            case SUPPORT_AGENT:
                return "agent";
            case ADMIN:
                return "admin";
            default:
                throw new IllegalArgumentException("Unknown role: " + role);
        }
    }

    @Override
    public Role convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        switch (dbData.toLowerCase()) {
            case "customer":
                return Role.CUSTOMER;
            case "agent":
                return Role.SUPPORT_AGENT;
            case "admin":
                return Role.ADMIN;
            default:
                throw new IllegalArgumentException("Unknown database value for Role: " + dbData);
        }
    }
}
