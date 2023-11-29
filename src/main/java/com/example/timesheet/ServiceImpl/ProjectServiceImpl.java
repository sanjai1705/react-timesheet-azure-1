package com.example.timesheet.ServiceImpl;

import com.example.timesheet.Entity.Project;
import com.example.timesheet.Respositories.ProjectRespository;
import com.example.timesheet.Service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {
    @Autowired
    ProjectRespository projectRespository;

    @Override
    public List<Project> getAllProjects() {
        return projectRespository.findAll();
    }

    @Override
    public Project getProjectById(Integer projectId) {
        return projectRespository.findById(projectId).orElse(null);
    }

    @Override
    public Project createProject(Project project) {
        return projectRespository.save(project);
    }

    @Override
    public Project updateProject(Integer projectId, Project updatedProject) {
        if (projectRespository.existsById(projectId)) {
            updatedProject.setProjectId(projectId);
            return projectRespository.save(updatedProject);
        } else {
            return null;
        }
    }

    @Override
    public List<Project> applicableDays(boolean applicable){
        return projectRespository.findByapplicable(applicable);


        //throw new IllegalArgumentException("it is not applicable");
    }

    @Override
    public void deleteProject(Integer projectId) {
        projectRespository.deleteById(projectId);
    }
}
