package com.example.timesheet.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "FlagCheck")
public class FlagCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Check_ID")
    private Integer checkId;
    @Column(name = "Unique_ID")
    private Integer uniqueId;
    @Column(name = "Timesheet_Type")
    private String timesheetType;

    public FlagCheck() {
    }

    public Integer getCheckId() {
        return checkId;
    }

    public void setCheckId(Integer checkId) {
        this.checkId = checkId;
    }

    public Integer getUniqueId() {
        return uniqueId;
    }

    public void setUniqueId(Integer uniqueId) {
        this.uniqueId = uniqueId;
    }

    public String getTimesheetType() {
        return timesheetType;
    }

    public void setTimesheetType(String timesheetType) {
        this.timesheetType = timesheetType;
    }
}
