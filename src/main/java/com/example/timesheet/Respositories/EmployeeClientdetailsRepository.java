package com.example.timesheet.Respositories;

import com.example.timesheet.Entity.EmployeeClientdetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeClientdetailsRepository extends JpaRepository<EmployeeClientdetails,Integer> {
}
