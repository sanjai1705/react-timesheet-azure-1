package com.example.timesheet.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "EmployeeRoles")
public class EmployeeRoles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EmpRol_Id")
    private Integer empRolId;

    @Column(name = "Desgination")
    private String designation;

    @Column(name = "Branch_Location")
    private String branchLocation;

    @Column(name = "Address")
    private String address;

    @ManyToOne
    @JoinColumn(name = "User_ID")
    private Users user;

    public EmployeeRoles() {
    }

    public Integer getEmpRolId() {
        return empRolId;
    }

    public void setEmpRolId(Integer empRolId) {
        this.empRolId = empRolId;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getBranchLocation() {
        return branchLocation;
    }

    public void setBranchLocation(String branchLocation) {
        this.branchLocation = branchLocation;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }
}
