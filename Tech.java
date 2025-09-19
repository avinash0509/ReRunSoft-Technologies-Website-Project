package com.example.react_spring_mysql.entity;



import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "technology")  // Ensure this matches the table name in your DB
public class Tech {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int techId;
    private String techDescription;

    // No-argument constructor (default constructor)
    public Tech() {

    }

    // constructors...
    public Tech(int techId, String techDescription) {
        this.techId = techId;
        this.techDescription = techDescription;
    }


    // Getters, setters,


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getTechId() {
        return techId;
    }

    public void setTechId(int techId) {
        this.techId = techId;
    }

    public String getTechDescription() {
        return techDescription;
    }

    public void setTechDescription(String techDescription) {
        this.techDescription = techDescription;
    }
}
