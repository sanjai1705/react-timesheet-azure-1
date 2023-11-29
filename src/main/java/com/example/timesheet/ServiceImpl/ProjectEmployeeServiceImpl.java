package com.example.timesheet.ServiceImpl;

import com.example.timesheet.Entity.EmployeeTimeentries;
import com.example.timesheet.Entity.ProjectEmployee;
import com.example.timesheet.Respositories.ProjectEmployeeRespository;
import com.example.timesheet.Service.ProjectEmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectEmployeeServiceImpl implements ProjectEmployeeService {
    @Autowired
    ProjectEmployeeRespository projectEmployeeRespository;

    @Override
    public List<ProjectEmployee> getAllProjectEmployees() {
        return projectEmployeeRespository.findAll();
    }

    @Override
    public ProjectEmployee getProjectEmployeeById(Integer id) {
        return projectEmployeeRespository.findById(id).orElse(null);
    }

    @Override
    public List<ProjectEmployee> getByUserId(Integer userId) {
        return projectEmployeeRespository.findByUserUserId(userId);
    }


    @Override
    public List<ProjectEmployee> getByProjectId(Integer projectId) {
        return projectEmployeeRespository.findByProjectProjectId(projectId);
    }

    @Override
    public ProjectEmployee createProjectEmployee(ProjectEmployee projectEmployee) {
        return projectEmployeeRespository.save(projectEmployee);
    }

    @Override
    public ProjectEmployee updateProjectEmployee(Integer id, ProjectEmployee projectEmployee) {
        if (projectEmployeeRespository.existsById(id)) {
            projectEmployee.setEmpID(id);
            return projectEmployeeRespository.save(projectEmployee);
        }
        return null; // Handle not found scenario
    }


    @Override
    public void deleteProjectEmployee(Integer id) {
        projectEmployeeRespository.deleteById(id);
    }
}
