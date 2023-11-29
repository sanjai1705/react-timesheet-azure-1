package com.example.timesheet.Respositories;

import com.example.timesheet.Entity.EmployeeRoles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRolesRespository extends JpaRepository<EmployeeRoles,Integer> {
}
