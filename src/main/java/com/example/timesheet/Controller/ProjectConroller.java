package com.example.timesheet.Controller;

import com.example.timesheet.Entity.Project;
import com.example.timesheet.Service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/Timesheet")
public class ProjectConroller {
    @Autowired
    ProjectService projectService;

    @GetMapping("/Project")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/Project/{projectId}")
    public Project getProjectById(@PathVariable Integer projectId) {

        return projectService.getProjectById(projectId);
    }
    @GetMapping("/Project/applicable")
    public List<Project> getProjectByapplicable(@RequestParam("applicable") boolean applicable) {

        return projectService.applicableDays(applicable);
    }

    @PostMapping("/Project/Create")
    public Project createProject(@RequestBody Project project) {

        return projectService.createProject(project);
    }

    @PutMapping("/Project/Update/{projectId}")
    public Project updateProject(@PathVariable Integer projectId, @RequestBody Project updatedProject) {
        return projectService.updateProject(projectId, updatedProject);
    }


    @DeleteMapping("/Project/Delete/{projectId}")
    public void deleteProject(@PathVariable Integer projectId) {
        projectService.deleteProject(projectId);
    }

}
