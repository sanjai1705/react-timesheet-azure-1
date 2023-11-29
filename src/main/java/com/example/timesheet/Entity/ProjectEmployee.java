package com.example.timesheet.Entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "ProjectEmployee")
public class ProjectEmployee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Emp_ID")
    private Integer empID;

    @ManyToOne
    @JoinColumn(name = "User_ID")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "Project_ID")
    private Project project;



    @Column(name = "Billing_Type")
    private String billingType;

    @Column(name = "Project_Start_Date")
    @Temporal(TemporalType.DATE)
    private Date projectStartDate;

    @Column(name = "Project_End_Date")
    @Temporal(TemporalType.DATE)
    private Date projectEndDate;

    @Column(name = "Restriction")
    private String restriction;

    public ProjectEmployee() {
    }

    public Integer getEmpID() {
        return empID;
    }

    public void setEmpID(Integer empID) {
        this.empID = empID;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getBillingType() {
        return billingType;
    }

    public void setBillingType(String billingType) {
        this.billingType = billingType;
    }

    public Date getProjectStartDate() {
        return projectStartDate;
    }

    public void setProjectStartDate(Date projectStartDate) {
        this.projectStartDate = projectStartDate;
    }

    public Date getProjectEndDate() {
        return projectEndDate;
    }

    public void setProjectEndDate(Date projectEndDate) {
        this.projectEndDate = projectEndDate;
    }

    public String getRestriction() {
        return restriction;
    }

    public void setRestriction(String restriction) {
        this.restriction = restriction;
    }
}
