package com.example.timesheet.Controller;

import com.example.timesheet.Entity.EmployeeRoles;
import com.example.timesheet.Service.EmployeeRolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/Timesheet")
public class EmployeeRolesController {
    @Autowired
    private EmployeeRolesService employeeRolesService;

    @GetMapping("/EmployeeRoles")
    public List<EmployeeRoles> getAllEmployeeRoles() {
        return employeeRolesService.getAllEmployeeRoles();
    }

    @GetMapping("/EmployeeRoles/{id}")
    public EmployeeRoles getEmployeeRoleById(@PathVariable Integer id) {
        return employeeRolesService.getEmployeeRoleById(id);
    }

    @PostMapping("/EmployeeRoles/Create")
    public EmployeeRoles createEmployeeRole(@RequestBody EmployeeRoles employeeRoles) {
        return employeeRolesService.createEmployeeRole(employeeRoles);
    }

    @PutMapping("/EmployeeRoles/Update/{id}")
    public EmployeeRoles updateEmployeeRole(@PathVariable Integer id, @RequestBody EmployeeRoles employeeRoles) {
        return employeeRolesService.updateEmployeeRole(id, employeeRoles);
    }

    @DeleteMapping("/EmployeeRoles/Delete/{id}")
    public void deleteEmployeeRole(@PathVariable Integer id) {
        employeeRolesService.deleteEmployeeRole(id);
    }
}
