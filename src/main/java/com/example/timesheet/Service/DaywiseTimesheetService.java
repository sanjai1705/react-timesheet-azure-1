package com.example.timesheet.Service;

import com.example.timesheet.Entity.DaywiseTimesheet;
import com.example.timesheet.Entity.EmployeeTimeentries;
import com.example.timesheet.Entity.Users;

import java.util.Date;
import java.util.List;

public interface DaywiseTimesheetService {
    List<DaywiseTimesheet> getAllDaywiseTimesheets();
    DaywiseTimesheet getDaywiseTimesheetById(Integer id);




    DaywiseTimesheet updateDaywiseTimesheet1(EmployeeTimeentries employeeTimeentries);



    Float CalculateByDateBetween(Users user, Date startdate, Date enddate);

    List<DaywiseTimesheet> customDate(Users user, Date startdate, Date enddate);



    void submitTimesheetInRange(Users user, Date startDate, Date endDate);


    void approveDaywistimesheet(Users user, Date startdate, Date enddate);





    void rejectTimesheetInRange(Users user, Date startDate, Date endDate, String description);

    void approveTimesheet(Integer timesheetId);


    //void updateRejectedstatus(Users user, Date date);

    DaywiseTimesheet createDaywiseTimesheet(DaywiseTimesheet daywiseTimesheet);
    DaywiseTimesheet updateDaywiseTimesheet(Integer id, DaywiseTimesheet daywiseTimesheet);
    void deleteDaywiseTimesheet(Integer id);


    List<List<DaywiseTimesheet>> getAllTimesheetEntries();

    List<DaywiseTimesheet> statuscheck(String status);

    List<DaywiseTimesheet> findByUserIdAndStatusIsNull(Integer userId);

    List<DaywiseTimesheet> findByUserIdAndStatusIsNotNull(Users userId, Date startDate, Date endDate);


    List<List<DaywiseTimesheet>> groupTimesheetsByTimestamp();


    void receivedDaywistimesheet(Users user, Date startdate, Date enddate);



}
