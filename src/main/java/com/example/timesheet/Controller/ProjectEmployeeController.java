package com.example.timesheet.Controller;

import com.example.timesheet.Entity.EmployeeTimeentries;
import com.example.timesheet.Entity.ProjectEmployee;
import com.example.timesheet.Service.ProjectEmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/Timesheet")
public class ProjectEmployeeController {
    @Autowired
    ProjectEmployeeService projectEmployeeService;

    @GetMapping("/ProjectEmployee")
    public List<ProjectEmployee> getAllProjectEmployees() {
        return projectEmployeeService.getAllProjectEmployees();
    }

    @GetMapping("/ProjectEmployee/{id}")
    public ProjectEmployee getProjectEmployeeById(@PathVariable Integer id) {
        return projectEmployeeService.getProjectEmployeeById(id);
    }


    @GetMapping("/ProjectEmployee/user/{userId}")
    public ResponseEntity<List<ProjectEmployee>> getTimeentriesByUserId(@PathVariable Integer userId) {
        List<ProjectEmployee> projectEmployees = projectEmployeeService.getByUserId(userId);
        return ResponseEntity.ok(projectEmployees);
    }

    @GetMapping("/ProjectEmployee/Project/{projectId}")
    public ResponseEntity<List<ProjectEmployee>> getByProjectId(@PathVariable Integer projectId) {
        List<ProjectEmployee> projectEmployees = projectEmployeeService.getByProjectId(projectId);
        return ResponseEntity.ok(projectEmployees);
    }

    @PostMapping("/ProjectEmployee/Create")
    public ProjectEmployee createProjectEmployee(@RequestBody ProjectEmployee projectEmployee) {
        return projectEmployeeService.createProjectEmployee(projectEmployee);
    }

    @PutMapping("/ProjectEmployee/Update/{id}")
    public ProjectEmployee updateProjectEmployee(@PathVariable Integer id, @RequestBody ProjectEmployee projectEmployee) {
        return projectEmployeeService.updateProjectEmployee(id, projectEmployee);
    }

    @DeleteMapping("/ProjectEmployee/Delete/{id}")
    public void deleteProjectEmployee(@PathVariable Integer id) {
        projectEmployeeService.deleteProjectEmployee(id);
    }

}
