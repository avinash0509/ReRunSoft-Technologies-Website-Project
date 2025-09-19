package com.example.react_spring_mysql.entity;


import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    private Long studentId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String division;

    @Column(nullable = false)
    private String section;

    @Column(nullable = false)
    private Double fees;

    @Column(nullable = false)
    private String busFacility; // 'yes' or 'no'

    @Version
    private Long version;

    // Getters and Setters
    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public Double getFees() {
        return fees;
    }

    public void setFees(Double fees) {
        this.fees = fees;
    }

    public String getBusFacility() {
        return busFacility;
    }

    public void setBusFacility(String busFacility) {
        this.busFacility = busFacility;
    }
}
