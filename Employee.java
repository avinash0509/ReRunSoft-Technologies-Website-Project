package com.example.react_spring_mysql.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;


import java.time.LocalDate;


import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_Id")
    private  Integer employeeId;

    private String firstName;
    private String lastName;
    private String address1;
    private String address2;
    private String address3;
    private String state;
    private String district;
    private String city;
    private Integer pincode;
    private LocalDate joiningDate;
    private String gender;
    @Column(nullable = false)
    private boolean admin = false;
    private boolean reporting =false;
    private boolean supervisor =false;
    private boolean user =false;
    private String designation;


public Employee(){

}

    public Employee(Integer employeeId, String firstName, String lastName, String address1, String address2, String address3, String state, String district, String city, Integer pincode, LocalDate joiningDate, String gender, boolean admin, boolean reporting, boolean supervisor, boolean user, String designation) {
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address1 = address1;
        this.address2 = address2;
        this.address3 = address3;
        this.state = state;
        this.district = district;
        this.city = city;
        this.pincode = pincode;
        this.joiningDate = joiningDate;
        this.gender = gender;
        this.admin = admin;
        this.reporting = reporting;
        this.supervisor = supervisor;
        this.user = user;
        this.designation = designation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getAddress1() {
        return address1;
    }

    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    public String getAddress2() {
        return address2;
    }

    public void setAddress2(String address2) {
        this.address2 = address2;
    }

    public String getAddress3() {
        return address3;
    }

    public void setAddress3(String address3) {
        this.address3 = address3;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getPincode() {
        return pincode;
    }

    public void setPincode(Integer pincode) {
        this.pincode = pincode;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public boolean getAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public boolean getReporting() {
        return reporting;
    }

    public void setReporting(boolean reporting) {
        this.reporting = reporting;
    }

    public boolean getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(boolean supervisor) {
        this.supervisor = supervisor;
    }

    public boolean getUser() {
        return user;
    }

    public void setUser(boolean user) {
        this.user = user;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}