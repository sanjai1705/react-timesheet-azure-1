package com.example.timesheet.Respositories;

import com.example.timesheet.Entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolesRespository extends JpaRepository<Roles,Integer> {



}
