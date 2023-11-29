package com.example.timesheet.Service;

import com.example.timesheet.Entity.EmployeeManager;
import com.example.timesheet.Entity.ProjectEmployee;

import java.util.List;
import java.util.Optional;

public interface EmployeeManagerService {

    List<EmployeeManager> findAll();
    Optional<EmployeeManager> findById(Integer id);




    List<EmployeeManager> getByUserId(Integer userId);

    EmployeeManager create(EmployeeManager employeeManager);
    EmployeeManager update(Integer id, EmployeeManager employeeManager);
   Void delete(Integer id);
}
