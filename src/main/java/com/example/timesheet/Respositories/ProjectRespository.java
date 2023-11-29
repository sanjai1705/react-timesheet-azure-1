package com.example.timesheet.Respositories;

import com.example.timesheet.Entity.Project;
import com.example.timesheet.Entity.ProjectEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRespository extends JpaRepository<Project,Integer> {

    //List<Project> findByapplicable(Boolean applicable);

    List<Project> findByapplicable(boolean applicable);


}
