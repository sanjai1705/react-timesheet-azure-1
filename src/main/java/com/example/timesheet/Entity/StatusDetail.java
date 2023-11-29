package com.example.timesheet.Entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "StatusDetail")
public class StatusDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StatusID")
    private Integer statusID;

    @Column(name = "Date")
    @Temporal(TemporalType.DATE)
    private Date date;

    @ManyToOne
    @JoinColumn(name = "User_ID")
    private Users user;

    @Column(name = "SaveTimestamp")
    private Date saveTimestamp;

    @Column(name = "SubmittedTimestamp")
    private Date submittedTimestamp;

    @Column(name = "ApprovedTimestamp")
    private Date approvedTimestamp;

    public StatusDetail() {
    }

    public Integer getStatusID() {
        return statusID;
    }

    public void setStatusID(Integer statusID) {
        this.statusID = statusID;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public Date getSaveTimestamp() {
        return saveTimestamp;
    }

    public void setSaveTimestamp(Date saveTimestamp) {
        this.saveTimestamp = saveTimestamp;
    }

    public Date getSubmittedTimestamp() {
        return submittedTimestamp;
    }

    public void setSubmittedTimestamp(Date submittedTimestamp) {
        this.submittedTimestamp = submittedTimestamp;
    }

    public Date getApprovedTimestamp() {
        return approvedTimestamp;
    }

    public void setApprovedTimestamp(Date approvedTimestamp) {
        this.approvedTimestamp = approvedTimestamp;
    }
}
