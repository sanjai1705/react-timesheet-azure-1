package com.example.timesheet.Entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "Yearlytable")
public class Yearlytable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "yearly_id")
    private Integer yearlyId;

    @Column(name = "start_date")
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Column(name = "end_date")
    @Temporal(TemporalType.DATE)
    private Date endDate;

    public Yearlytable() {
    }

    public Integer getYearlyId() {
        return yearlyId;
    }

    public void setYearlyId(Integer yearlyId) {
        this.yearlyId = yearlyId;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }
}
