package com.example.react_spring_mysql.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "districtt")
public class District {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  int id;
    private int districtId;
    private String districtName;
    private int stateId;

    // Constructors
    public District() {

    }

    public District(int districtId, String districtName, int stateId) {
        this.districtId = districtId;
        this.districtName = districtName;
        this.stateId = stateId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getDistrictId() {
        return districtId;
    }

    public void setDistrictId(int districtId) {
        this.districtId = districtId;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public int getStateId() {
        return stateId;
    }

    public void setStateId(int stateId) {
        this.stateId = stateId;
    }
}


