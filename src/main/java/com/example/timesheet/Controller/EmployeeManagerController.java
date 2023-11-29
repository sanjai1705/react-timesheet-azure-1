package com.example.timesheet.Controller;

import com.example.timesheet.Entity.EmployeeManager;
import com.example.timesheet.Service.EmployeeManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/Timesheet")
public class EmployeeManagerController {

    @Autowired
    EmployeeManagerService employeeManagerService;

    @GetMapping("/EmployeeManager")
    public ResponseEntity<List<EmployeeManager>> findAll() {
        List<EmployeeManager> employeeManagers = employeeManagerService.findAll();
        return ResponseEntity.ok(employeeManagers);
    }

    @GetMapping("/EmployeeManager/{id}")
    public ResponseEntity<EmployeeManager> findById(@PathVariable Integer id) {
        Optional<EmployeeManager> employeeManager = employeeManagerService.findById(id);
        return employeeManager.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/EmployeeManager/Manager/{userId}")
    public List<EmployeeManager>getTimeentriesByUserId(@PathVariable Integer userId) {
        List<EmployeeManager> employeeManager =employeeManagerService.getByUserId(userId);
        return employeeManager;
    }
    @PostMapping("/EmployeeManager/Create")
    public ResponseEntity<EmployeeManager> create(@RequestBody EmployeeManager employeeManager) {
        EmployeeManager createdEmployeeManager = employeeManagerService.create(employeeManager);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEmployeeManager);
    }

    @PutMapping("/EmployeeManager/{id}")
    public ResponseEntity<EmployeeManager> update(@PathVariable Integer id, @RequestBody EmployeeManager employeeManager) {
        EmployeeManager updatedEmployeeManager = employeeManagerService.update(id, employeeManager);
        return ResponseEntity.ok(updatedEmployeeManager);
    }

    @DeleteMapping("/EmployeeManager/{id}")
    public Void delete(@PathVariable Integer id) {
        return employeeManagerService.delete(id);

    }
}
