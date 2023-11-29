package com.example.timesheet.ServiceImpl;

import com.example.timesheet.Entity.EmployeeManager;
import com.example.timesheet.Entity.ProjectEmployee;
import com.example.timesheet.Respositories.EmployeeManagerRespository;
import com.example.timesheet.Service.EmployeeManagerService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeManagerServiceImpl implements EmployeeManagerService {
    @Autowired
    EmployeeManagerRespository employeeManagerRespository;


    @Override
    public List<EmployeeManager> findAll() {
        return employeeManagerRespository.findAll();
    }

    @Override
    public Optional<EmployeeManager> findById(Integer id) {
        return employeeManagerRespository.findById(id);
    }


    @Override
    public List<EmployeeManager> getByUserId(Integer userId) {

        return employeeManagerRespository.findByUserUserId(userId);
    }



    @Override
    public EmployeeManager create(EmployeeManager employeeManager) {
        return employeeManagerRespository.save(employeeManager);
    }

    @Override
    public EmployeeManager update(Integer id, EmployeeManager updatedEmployeeManager) {
        if (!employeeManagerRespository.existsById(id)) {
            throw new EntityNotFoundException("EmployeeManager not found with id: " + id);
        }
        updatedEmployeeManager.setId(id);
        return employeeManagerRespository.save(updatedEmployeeManager);
    }

    @Override
    public Void delete(Integer id) {
        employeeManagerRespository.deleteById(id);
        return null;
    }

}
