package com.ecommerce.backend.dto;

public class UserProfileDto {
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private String address;
    private String phone;

    public UserProfileDto() {
    }

    public UserProfileDto(Long id, String email, String fullName, String role, String address, String phone) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.address = address;
        this.phone = phone;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
