package com.example.react_spring_mysql.entity;
import jakarta.persistence.*;



@Entity
@Table(name = "statet")
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int stateId;
    private String stateName;


    // Constructors
    public State() {

    }

    public State(int id, int stateId, String stateName) {
        this.id = id;
        this.stateId = stateId;
        this.stateName = stateName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getStateId() {
        return stateId;
    }

    public void setStateId(int stateId) {
        this.stateId = stateId;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }
}

