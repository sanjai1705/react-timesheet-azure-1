package com.example.timesheet.Service;

import com.example.timesheet.Entity.EmployeeRoles;

import java.util.List;

public interface EmployeeRolesService {
    List<EmployeeRoles> getAllEmployeeRoles();
    EmployeeRoles getEmployeeRoleById(Integer id);
    EmployeeRoles createEmployeeRole(EmployeeRoles employeeRoles);
    EmployeeRoles updateEmployeeRole(Integer id, EmployeeRoles employeeRoles);
    void deleteEmployeeRole(Integer id);
}
