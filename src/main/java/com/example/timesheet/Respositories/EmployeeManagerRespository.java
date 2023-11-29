package com.example.timesheet.Respositories;

import com.example.timesheet.Entity.EmployeeManager;
import com.example.timesheet.Entity.ProjectEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.yaml.snakeyaml.events.Event;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeManagerRespository extends JpaRepository<EmployeeManager ,Integer> {





    List<EmployeeManager> findByUserUserId(Integer userId);
}
