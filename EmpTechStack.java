package com.example.react_spring_mysql.entity;


import jakarta.persistence.*;

@Entity
@Table(name = "emptechstack")
public class EmpTechStack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;  // You can create a composite ID or use an auto-generated ID for simplicity

    private int employeeId; // Employee associated with this tech stack
    private int techId; // Technology associated with this employee

    // NoArgument
    public EmpTechStack (){

    }

    // Constructor


    public EmpTechStack(int employeeId, int techId) {
        this.employeeId = employeeId;
        this.techId = techId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    public int getTechId() {
        return techId;
    }

    public void setTechId(int techId) {
        this.techId = techId;
    }

    // toString


    /*@Override
    public String toString() {
        return "EmpTechStack{" +
                "id=" + id +
                ", employeeId=" + employeeId +
                ", techId=" + techId +
                '}';
    }*/
}
