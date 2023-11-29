package com.example.timesheet.Service;

import com.example.timesheet.Entity.EmployeeClientdetails;

import java.util.List;

public interface EmployeeClientdetailsService {

    List<EmployeeClientdetails> getAllEmployeeClientdetails();
    EmployeeClientdetails getEmployeeClientdetailsById(Integer id);
    EmployeeClientdetails createEmployeeClientdetails(EmployeeClientdetails employeeClientdetails);
    EmployeeClientdetails updateEmployeeClientdetails(Integer id, EmployeeClientdetails employeeClientdetails);
    void deleteEmployeeClientdetails(Integer id);
}
