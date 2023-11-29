package com.example.timesheet.Service;

import com.example.timesheet.Entity.Project;

import java.util.List;

public interface ProjectService {

    List<Project> getAllProjects();
    Project getProjectById(Integer projectId);
    Project createProject(Project project);
    Project updateProject(Integer projectId, Project project);






    List<Project> applicableDays(boolean applicable);

    void deleteProject(Integer projectId);
}
