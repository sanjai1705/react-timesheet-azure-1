package com.example.timesheet.Entity;

import jakarta.persistence.*;

import java.util.Date;
@Entity
@Table(name = "Project")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Project_ID")
    private Integer projectId;

    @Column(name = "Project_Name")
    private String projectName;

    @Column(name = "Client_Name")
    private String clientName;

    @Column(name = "Billing_Type")
    private String billingType;

    @Column(name = "Description")
    private String description;

    @Column(name = "Start_Date")
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Column(name = "End_Date")
    @Temporal(TemporalType.DATE)
    private Date endDate;

    @Column(name = "Applicable")
    private Boolean applicable;



    public Project() {
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getBillingType() {
        return billingType;
    }

    public void setBillingType(String billingType) {
        this.billingType = billingType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public Boolean getApplicable() {
        return applicable;
    }

    public void setApplicable(Boolean applicable) {
        this.applicable = applicable;
    }
}
