package com.supportflow.dto;

public class LoginResponse {
    private boolean success;
    private LoginData data;
    private String message;

    // Constructors
    public LoginResponse() {
    }

    public LoginResponse(boolean success, LoginData data, String message) {
        this.success = success;
        this.data = data;
        this.message = message;
    }

    // Static helper for failure responses
    public static LoginResponse failure(String message) {
        return new LoginResponse(false, null, message);
    }

    // Static helper for success responses
    public static LoginResponse success(String token, Long id, String name, String email, String role, String message) {
        UserData user = new UserData(id, name, email, role);
        LoginData data = new LoginData(token, user);
        return new LoginResponse(true, data, message);
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public LoginData getData() {
        return data;
    }

    public void setData(LoginData data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // Nested structures
    public static class LoginData {
        private String token;
        private UserData user;

        public LoginData() {}

        public LoginData(String token, UserData user) {
            this.token = token;
            this.user = user;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public UserData getUser() {
            return user;
        }

        public void setUser(UserData user) {
            this.user = user;
        }
    }

    public static class UserData {
        private Long id;
        private String name;
        private String email;
        private String role;

        public UserData() {}

        public UserData(Long id, String name, String email, String role) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}
