package com.example.timesheet.Respositories;

import com.example.timesheet.Entity.DaywiseTimesheet;
import com.example.timesheet.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface DaywiseTimesheetRespository extends JpaRepository<DaywiseTimesheet,Integer> {



    List<DaywiseTimesheet> findByDateBetween(Date startdate, Date enddate);



    DaywiseTimesheet findByUserAndDate(Users user, Date date);


    List<DaywiseTimesheet> findByUserAndDateBetween(Users user, Date startdate, Date enddate);


    List<DaywiseTimesheet> findByStatus(String status);

    List<DaywiseTimesheet> findByUserAndStatusIsNull(Users user);

    List<DaywiseTimesheet> findAllByOrderByTimestamp();




    List<DaywiseTimesheet> findByDate(Date sameDate);


    @Query("SELECT d FROM DaywiseTimesheet d WHERE d.user = :userId AND d.status IS NOT NULL AND d.date BETWEEN :startDate AND :endDate")
    List<DaywiseTimesheet> findByUserAndStatusIsNotNull(
            @Param("userId") Users userId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );




}
