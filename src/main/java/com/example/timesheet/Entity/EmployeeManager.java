package com.example.timesheet.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "EmployeeManager")
public class EmployeeManager {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "Managers_ID", referencedColumnName = "User_ID", insertable = false, updatable = false)
    private Users user;

    @ManyToOne
    @JoinColumn(name = "Employee_ID",referencedColumnName = "User_ID")
    private Users user1;

    public EmployeeManager() {
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

    public Users getUser1() {
        return user1;
    }

    public void setUser1(Users user1) {
        this.user1 = user1;
    }
}
