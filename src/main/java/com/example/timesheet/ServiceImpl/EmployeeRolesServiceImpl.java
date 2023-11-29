package com.example.timesheet.ServiceImpl;

import com.example.timesheet.Entity.EmployeeRoles;
import com.example.timesheet.Respositories.EmployeeRolesRespository;
import com.example.timesheet.Service.EmployeeRolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeRolesServiceImpl implements EmployeeRolesService {
    @Autowired
    private EmployeeRolesRespository employeeRolesRespository;

    @Override
    public List<EmployeeRoles> getAllEmployeeRoles() {
        return employeeRolesRespository.findAll();
    }

    @Override
    public EmployeeRoles getEmployeeRoleById(Integer id) {
        return employeeRolesRespository.findById(id).orElse(null);
    }

    @Override
    public EmployeeRoles createEmployeeRole(EmployeeRoles employeeRoles) {
        return employeeRolesRespository.save(employeeRoles);
    }

    @Override
    public EmployeeRoles updateEmployeeRole(Integer id, EmployeeRoles employeeRole) {
        if (employeeRolesRespository.existsById(id)) {
            employeeRole.setEmpRolId(id);
            return employeeRolesRespository.save(employeeRole);
        }
        return null;
    }

    @Override
    public void deleteEmployeeRole(Integer id) {
        employeeRolesRespository.deleteById(id);
    }
}
