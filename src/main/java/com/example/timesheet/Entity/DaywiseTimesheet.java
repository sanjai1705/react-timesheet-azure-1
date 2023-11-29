package com.example.timesheet.Entity;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.*;

@Entity
@Table(name = "DaywiseTimesheet")
public class DaywiseTimesheet  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "User_ID")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "yearly_id")
    private Yearlytable yearlytable;


    @Column(name = "Date")
    @Temporal(TemporalType.DATE)
    private Date date;

    @Column(name = "Working_Hours")
    private Float workingHours;

    @Column(name = "Overtime")
    private Float overtime;

    @Column(name = "Total_Working_Hours")
    private Float totalWorkingHours;

    @Column(name = "Status")
    private String status;

    @Column(name = "Description")
    private String description;

    @Column(name = "Timestamp")
    private java.sql.Timestamp timestamp;

    public DaywiseTimesheet() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public Yearlytable getYearlytable() {
        return yearlytable;
    }

    public void setYearlytable(Yearlytable yearlytable) {
        this.yearlytable = yearlytable;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Float getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(Float workingHours) {
        this.workingHours = workingHours;
    }

    public Float getOvertime() {
        return overtime;
    }

    public void setOvertime(Float overtime) {
        this.overtime = overtime;
    }

    public Float getTotalWorkingHours() {
        return totalWorkingHours;
    }

    public void setTotalWorkingHours(Float totalWorkingHours) {
        this.totalWorkingHours = totalWorkingHours;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
}
