package com.example.timesheet.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "EmployeeClientdetails")
public class EmployeeClientdetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EmpClientdetail_ID")
    private Integer empClientdetailId;

    @ManyToOne
    @JoinColumn(name = "EmpRol_Id")
    private EmployeeRoles employeeRoles;

    @ManyToOne
    @JoinColumn(name = "Client_Id")
    private ClientTable clientTable;

    public EmployeeClientdetails() {
    }

    public Integer getEmpClientdetailId() {
        return empClientdetailId;
    }

    public void setEmpClientdetailId(Integer empClientdetailId) {
        this.empClientdetailId = empClientdetailId;
    }

    public EmployeeRoles getEmployeeRoles() {
        return employeeRoles;
    }

    public void setEmployeeRoles(EmployeeRoles employeeRoles) {
        this.employeeRoles = employeeRoles;
    }

    public ClientTable getClientTable() {
        return clientTable;
    }

    public void setClientTable(ClientTable clientTable) {
        this.clientTable = clientTable;
    }
}
