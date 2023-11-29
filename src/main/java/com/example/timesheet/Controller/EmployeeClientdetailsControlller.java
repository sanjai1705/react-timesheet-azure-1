package com.example.timesheet.Controller;

import com.example.timesheet.Entity.EmployeeClientdetails;
import com.example.timesheet.Service.EmployeeClientdetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins="http://localhost:3000")
@RestController

public class EmployeeClientdetailsControlller {
    @Autowired
     EmployeeClientdetailsService employeeClientdetailsService;




    @GetMapping
    public List<EmployeeClientdetails> getAllEmployeeClientdetails() {
        return employeeClientdetailsService.getAllEmployeeClientdetails();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeClientdetails> getEmployeeClientdetailsById(@PathVariable Integer id) {
        EmployeeClientdetails employeeClientdetails = employeeClientdetailsService.getEmployeeClientdetailsById(id);
        if (employeeClientdetails != null) {
            return ResponseEntity.ok(employeeClientdetails);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<EmployeeClientdetails> createEmployeeClientdetails(@RequestBody EmployeeClientdetails employeeClientdetails) {
        EmployeeClientdetails createdEmployeeClientdetails = employeeClientdetailsService.createEmployeeClientdetails(employeeClientdetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEmployeeClientdetails);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeClientdetails> updateEmployeeClientdetails(@PathVariable Integer id, @RequestBody EmployeeClientdetails updatedEmployeeClientdetails) {
        EmployeeClientdetails employeeClientdetails = employeeClientdetailsService.updateEmployeeClientdetails(id, updatedEmployeeClientdetails);
        if (employeeClientdetails != null) {
            return ResponseEntity.ok(employeeClientdetails);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployeeClientdetails(@PathVariable Integer id) {
        employeeClientdetailsService.deleteEmployeeClientdetails(id);
        return ResponseEntity.noContent().build();
    }


}
