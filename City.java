package com.example.react_spring_mysql.entity;
import jakarta.persistence.*;



@Entity
@Table(name = "cityt")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int cityId;
    private String cityName;
    private int districtId;

    // Constructors
    public City() {

    }

    public City(int cityId, String cityName, int districtId) {
        this.cityId = cityId;
        this.cityName = cityName;
        this.districtId = districtId;
    }

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCityId() {
        return cityId;
    }

    public void setCityId(int cityId) {
        this.cityId = cityId;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public int getDistrictId() {
        return districtId;
    }

    public void setDistrictId(int districtId) {
        this.districtId = districtId;
    }
}
