package com.example.timesheet.Respositories;

import com.example.timesheet.Entity.Yearlytable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface YearlytableRespository extends JpaRepository<Yearlytable,Integer> {



}
