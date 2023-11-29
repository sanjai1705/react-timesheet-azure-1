package com.example.timesheet.Respositories;

import com.example.timesheet.Entity.FlagCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlagCheckRespository extends JpaRepository<FlagCheck,Integer> {

}
