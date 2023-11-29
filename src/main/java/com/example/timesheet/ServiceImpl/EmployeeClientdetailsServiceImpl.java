package com.example.timesheet.ServiceImpl;

import com.example.timesheet.Entity.EmployeeClientdetails;
import com.example.timesheet.Respositories.EmployeeClientdetailsRepository;
import com.example.timesheet.Service.EmployeeClientdetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class EmployeeClientdetailsServiceImpl implements EmployeeClientdetailsService {

    @Autowired
    EmployeeClientdetailsRepository employeeClientdetailsRepository;

    @Override
    public List<EmployeeClientdetails> getAllEmployeeClientdetails() {
        return employeeClientdetailsRepository.findAll();
    }

    @Override
    public EmployeeClientdetails getEmployeeClientdetailsById(Integer id) {
        return employeeClientdetailsRepository.findById(id).orElse(null);
    }

    @Override
    public EmployeeClientdetails createEmployeeClientdetails(EmployeeClientdetails employeeClientdetails) {
        return employeeClientdetailsRepository.save(employeeClientdetails);
    }

    @Override
    public EmployeeClientdetails updateEmployeeClientdetails(Integer id, EmployeeClientdetails updatedEmployeeClientdetails) {
        if (employeeClientdetailsRepository.existsById(id)) {
            updatedEmployeeClientdetails.setEmpClientdetailId(id);
            return employeeClientdetailsRepository.save(updatedEmployeeClientdetails);
        }
        return null;
    }

    @Override
    public void deleteEmployeeClientdetails(Integer id) {
        employeeClientdetailsRepository.deleteById(id);
    }

}
