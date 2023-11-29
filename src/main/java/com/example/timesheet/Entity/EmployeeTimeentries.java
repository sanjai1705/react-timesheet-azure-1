package com.example.timesheet.Entity;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "EmployeeTimeentries")
public class EmployeeTimeentries {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Timesheet_ID")
    private Integer timesheetId;

    @ManyToOne
    @JoinColumn(name = "User_ID")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "Emp_ID")
    private ProjectEmployee projectEmployee;

    @ManyToOne
    @JoinColumn(name = "yearly_id")
    private Yearlytable yearlytable;

    @Column(name = "Date")
    @Temporal(TemporalType.DATE)
    private Date date;

    @Column(name = "Login")
    private String login;

    @Column(name = "Logout")
    private String logout;

    @Column(name = "Minutes")
    private Integer minutes;

    @Column(name = "Status")
    private String status;

    @Column(name = "Task")
    private String task;

    @Column(name = "Timestamp")
    private Date timestamp;

    public EmployeeTimeentries() {
    }

    public Integer getTimesheetId() {
        return timesheetId;
    }

    public void setTimesheetId(Integer timesheetId) {
        this.timesheetId = timesheetId;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public ProjectEmployee getProjectEmployee() {
        return projectEmployee;
    }

    public void setProjectEmployee(ProjectEmployee projectEmployee) {
        this.projectEmployee = projectEmployee;
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

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getLogout() {
        return logout;
    }

    public void setLogout(String logout) {
        this.logout = logout;
    }

    public Integer getMinutes() {
        return minutes;
    }

    public void setMinutes(Integer minutes) {
        this.minutes = minutes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
}
