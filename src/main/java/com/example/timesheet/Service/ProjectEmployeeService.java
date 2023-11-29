package com.example.timesheet.Service;

import com.example.timesheet.Entity.EmployeeTimeentries;
import com.example.timesheet.Entity.ProjectEmployee;

import java.util.List;

public interface ProjectEmployeeService {

    List<ProjectEmployee> getAllProjectEmployees();
    ProjectEmployee getProjectEmployeeById(Integer id);

    List<ProjectEmployee> getByUserId(Integer userId);

    List<ProjectEmployee> getByProjectId(Integer projectId);
    ProjectEmployee createProjectEmployee(ProjectEmployee projectEmployee);
    ProjectEmployee updateProjectEmployee(Integer id, ProjectEmployee projectEmployee);
    void deleteProjectEmployee(Integer id);
}
