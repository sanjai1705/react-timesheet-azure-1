package com.example.timesheet.ServiceImpl;

import com.example.timesheet.Entity.*;
import com.example.timesheet.Respositories.DaywiseTimesheetRespository;
import com.example.timesheet.Respositories.EmployeeTimeentriesRespository;
import com.example.timesheet.Respositories.StatusDetailRespository;
import com.example.timesheet.Respositories.YearlytableRespository;
import com.example.timesheet.Service.DaywiseTimesheetService;
import com.example.timesheet.Service.StatusDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

@Service

public class DaywiseTimesheetServiceImpl implements DaywiseTimesheetService {

    @Autowired
    DaywiseTimesheetRespository daywiseTimesheetRespository;
    @Autowired
    EmployeeTimeentriesRespository employeeTimeentriesRespository;

    @Autowired
    StatusDetailRespository statusDetailRespository;

    @Autowired
    YearlytableRespository yearlytableRespository;

    @Autowired
    StatusDetailService statusDetailService;

    @Override
    public List<DaywiseTimesheet> getAllDaywiseTimesheets() {
        return daywiseTimesheetRespository.findAll();
    }

    @Override
    public DaywiseTimesheet getDaywiseTimesheetById(Integer id) {
        return daywiseTimesheetRespository.findById(id).orElse(null);
    }
    @Override
    public DaywiseTimesheet updateDaywiseTimesheet1(EmployeeTimeentries employeeTimeentries) {
        DaywiseTimesheet daywiseTimesheet = daywiseTimesheetRespository.findByUserAndDate(employeeTimeentries.getUser(), employeeTimeentries.getDate());

        Float workingHours = employeeTimeentries.getMinutes() / 60.0f;
        String status = employeeTimeentries.getStatus();
        Float overtime = 0.0f;

        if (workingHours > 8.0f) {
            overtime = workingHours - 8.0f;
            workingHours = 8.0f;
        }

        Float totalWorkingHours = workingHours + overtime;

        if (daywiseTimesheet == null) {
            // Create a new DaywiseTimesheet if it doesn't exist
            daywiseTimesheet = new DaywiseTimesheet();
            daywiseTimesheet.setUser(employeeTimeentries.getUser());
            daywiseTimesheet.setDate(employeeTimeentries.getDate());
            daywiseTimesheet.setStatus(status);
            daywiseTimesheet.setWorkingHours(workingHours);
            daywiseTimesheet.setOvertime(overtime);
            daywiseTimesheet.setTotalWorkingHours(totalWorkingHours);
            daywiseTimesheet.setYearlytable(employeeTimeentries.getYearlytable());
        } else {
            // Update the existing DaywiseTimesheet
            List<EmployeeTimeentries> entriesForDate = employeeTimeentriesRespository
                    .findByUserAndDate(employeeTimeentries.getUser(), employeeTimeentries.getDate());

            Float recalculatedWorkingHours = 0.0f;
            Float recalculatedOvertime = 0.0f;

            for (EmployeeTimeentries entry : entriesForDate) {
                Float entryWorkingHours = entry.getMinutes() / 60.0f;

                if (entryWorkingHours > 8.0f) {
                    recalculatedOvertime += entryWorkingHours - 8.0f;
                    entryWorkingHours = 8.0f;
                }

                recalculatedWorkingHours += entryWorkingHours;
            }

// Correct the condition here
            if (recalculatedWorkingHours > 8.0f) {
                recalculatedOvertime += recalculatedWorkingHours - 8.0f;
                recalculatedWorkingHours = 8.0f;
            }

            daywiseTimesheet.setWorkingHours(recalculatedWorkingHours);
            daywiseTimesheet.setOvertime(recalculatedOvertime);
            daywiseTimesheet.setTotalWorkingHours(recalculatedWorkingHours + recalculatedOvertime);
            daywiseTimesheet.setYearlytable(employeeTimeentries.getYearlytable());

        }





        return daywiseTimesheetRespository.save(daywiseTimesheet);
    }


    @Override
    public Float CalculateByDateBetween( Users user,Date startdate, Date enddate){
        List<DaywiseTimesheet> totalworkinghoursrecords = daywiseTimesheetRespository.findByUserAndDateBetween(user,startdate,enddate);
        Float totalWorkingHours = 0.0f;
        for (DaywiseTimesheet record : totalworkinghoursrecords) {
            totalWorkingHours = totalWorkingHours +record.getTotalWorkingHours();
        }
        return totalWorkingHours;
    }


    @Override
    public List<DaywiseTimesheet> customDate(Users user, Date startdate, Date enddate){
        List<DaywiseTimesheet> customDate = daywiseTimesheetRespository.findByUserAndDateBetween(user, startdate, enddate);
        return customDate;
    }


    @Override
    public void submitTimesheetInRange(Users user, Date startdate, Date enddate) {

        List<DaywiseTimesheet> timesheetsInRange = daywiseTimesheetRespository.findByUserAndDateBetween(user, startdate, enddate);
        for (DaywiseTimesheet timesheet : timesheetsInRange) {
            if (!"Submitted".equals(timesheet.getStatus())) {
                timesheet.setStatus("Submitted");
                timesheet.setDescription("completed");
                Timestamp currentTimestamp = Timestamp.valueOf(LocalDateTime.now());
                timesheet.setTimestamp(currentTimestamp);
                List<EmployeeTimeentries> timeentriesToUpdate = employeeTimeentriesRespository.findByUserAndDate(user, timesheet.getDate());

                for (EmployeeTimeentries timeentry : timeentriesToUpdate) {
                    timeentry.setStatus("Submitted");
                    timeentry.setTimestamp(currentTimestamp);




                }
                StatusDetail statusdetail = statusDetailRespository.findStatusDetailByUserAndDate(timesheet.getUser(),timesheet.getDate());
                statusdetail.setSubmittedTimestamp(Timestamp.valueOf(LocalDateTime.now()));
                statusDetailRespository.save(statusdetail);
                daywiseTimesheetRespository.save(timesheet); // Save the updated status in DaywiseTimesheet
                employeeTimeentriesRespository.saveAll(timeentriesToUpdate); // Save the updated status in EmployeeTimeentries
                daywiseTimesheetRespository.save(timesheet);// Save the updated status
            }
        }
    }

    @Override
    public void approveDaywistimesheet(Users user, Date startdate, Date enddate) {
        List<DaywiseTimesheet> timesheetsInRange = daywiseTimesheetRespository.findByUserAndDateBetween(user, startdate, enddate);

        for (DaywiseTimesheet timesheet : timesheetsInRange) {
            if (!"Approved".equals(timesheet.getStatus())&&"Submitted".equals(timesheet.getStatus())) {
                timesheet.setStatus("Approved");
                timesheet.setDescription("completed");
                Timestamp currentTimestamp = Timestamp.valueOf(LocalDateTime.now());
                timesheet.setTimestamp(currentTimestamp);

                List<EmployeeTimeentries> timeentriesToUpdate = employeeTimeentriesRespository.findByUserAndDate(user, timesheet.getDate());
                for (EmployeeTimeentries timeentry : timeentriesToUpdate) {
                    timeentry.setStatus("Approved");
                    timeentry.setTimestamp(currentTimestamp);
                }
                StatusDetail statusdetail = statusDetailRespository.findStatusDetailByUserAndDate(timesheet.getUser(),timesheet.getDate());
                statusdetail.setApprovedTimestamp(Timestamp.valueOf(LocalDateTime.now()));
                statusDetailRespository.save(statusdetail);
                daywiseTimesheetRespository.save(timesheet); // Save the updated status in DaywiseTimesheet
                employeeTimeentriesRespository.saveAll(timeentriesToUpdate); // Save the updated status in EmployeeTimeentries
                daywiseTimesheetRespository.save(timesheet);
            }


        }
    }

    @Override
    public void rejectTimesheetInRange(Users user, Date startDate, Date endDate, String description) {
        List<DaywiseTimesheet> timesheetsInRange = daywiseTimesheetRespository.findByUserAndDateBetween(user, startDate, endDate);

        for (DaywiseTimesheet timesheet : timesheetsInRange) {
            if (!"Rejected".equals(timesheet.getStatus())) {
                timesheet.setStatus("Rejected");
                timesheet.setDescription(description);
                Timestamp currentTimestamp = Timestamp.valueOf(LocalDateTime.now());
                timesheet.setTimestamp(currentTimestamp);
                List<EmployeeTimeentries> timeentriesToUpdate = employeeTimeentriesRespository.findByUserAndDate(user, timesheet.getDate());
                for (EmployeeTimeentries timeentry : timeentriesToUpdate) {
                    timeentry.setStatus("Rejected");
                    timeentry.setTimestamp(currentTimestamp);
                }

                daywiseTimesheetRespository.save(timesheet);
                employeeTimeentriesRespository.saveAll(timeentriesToUpdate);


                daywiseTimesheetRespository.save(timesheet);
            }
        }
    }




    @Override
    public void approveTimesheet(Integer timesheetId) {
        DaywiseTimesheet timesheet = daywiseTimesheetRespository.findById(timesheetId).orElse(null);

        if (timesheet != null && !"Approved".equals(timesheet.getStatus())) {
            timesheet.setStatus("Approved");
            timesheet.setDescription("completed");

            daywiseTimesheetRespository.save(timesheet);
        } else {
            throw new IllegalArgumentException("Cannot approve a Submitted or Approved timesheet.");
        }
    }
    /*@Override
    public void updateRejectedstatus(Users user, Date date) {
        List<DaywiseTimesheet> timesheets = daywiseTimesheetRespository.findByUserAndDate(user,date);

        if (timesheet != null && "rejected".equalsIgnoreCase(timesheets.getStatus())) {
            // Update or delete logic here
            // ...
            timesheets.setStatus(null);
            timesheets.setDescription("");
            daywiseTimesheetRespository.save(timesheet);
        }
    }*/



    @Override
    public DaywiseTimesheet createDaywiseTimesheet(DaywiseTimesheet daywiseTimesheet) {
        if (!"Submitted".equals(daywiseTimesheet.getStatus())) {
            StatusDetail statusdetail = new StatusDetail();
            statusdetail.setDate(daywiseTimesheet.getDate());
            Timestamp currentTimestamp = Timestamp.valueOf(LocalDateTime.now());
            statusdetail.setSaveTimestamp(currentTimestamp);
            statusDetailRespository.save(statusdetail);
            return daywiseTimesheetRespository.save(daywiseTimesheet);

        }
        // Handle the case where status is "Submitted"
        throw new IllegalArgumentException("Cannot update a Submitted timesheet.");
    }

    @Override
    public DaywiseTimesheet updateDaywiseTimesheet(Integer id, DaywiseTimesheet daywiseTimesheet) {
        if (daywiseTimesheetRespository.existsById(id)) {
            daywiseTimesheet.setId(id);
            return daywiseTimesheetRespository.save(daywiseTimesheet);
        }
        return null;
    }

    @Override
    public void deleteDaywiseTimesheet(Integer id) {

        DaywiseTimesheet timesheet = daywiseTimesheetRespository.findById(id).orElse(null);
        if (timesheet != null && !"Submitted".equals(timesheet.getStatus()) && !"Approved".equals(timesheet.getStatus())) {
            daywiseTimesheetRespository.delete(timesheet);




        } else {
            // Handle the case where status is "Submitted"
            throw new IllegalArgumentException("Cannot delete a Submitted timesheet.");
        }
    }

    @Override
    public List<List<DaywiseTimesheet>> getAllTimesheetEntries() {

        List<DaywiseTimesheet> entries = daywiseTimesheetRespository.findAll();

        List<List<DaywiseTimesheet>> groupedEntries = new ArrayList<>();
        Timestamp currentTimestamp = null;
        List<DaywiseTimesheet> currentGroup = null;

        for (DaywiseTimesheet entry : entries) {
            if (currentTimestamp == null || !currentTimestamp.equals(entry.getTimestamp())) {
                // Start a new group
                if (currentGroup != null) {
                    groupedEntries.add(currentGroup);
                }
                currentGroup = new ArrayList<>();
                currentTimestamp = entry.getTimestamp();
            }
            currentGroup.add(entry);
        }

        // Add the last group
        if (currentGroup != null) {
            groupedEntries.add(currentGroup);
        }

        return groupedEntries;
    }


    @Override
    public List<DaywiseTimesheet> statuscheck(String status) {
        return daywiseTimesheetRespository.findByStatus(status);
    }

    @Override
    public List<DaywiseTimesheet> findByUserIdAndStatusIsNull(Integer userId) {
        Users user = new Users();
        user.setUserId(userId);
        return daywiseTimesheetRespository.findByUserAndStatusIsNull(user);
    }
    @Override
    public List<DaywiseTimesheet> findByUserIdAndStatusIsNotNull(Users userId, Date startDate, Date endDate) {
        return daywiseTimesheetRespository.findByUserAndStatusIsNotNull(userId, startDate, endDate);
    }


    @Override
    public List<List<DaywiseTimesheet>> groupTimesheetsByTimestamp() {
        List<DaywiseTimesheet> timesheets = daywiseTimesheetRespository.findAllByOrderByTimestamp();
        List<List<DaywiseTimesheet>>groupedTimesheets = new ArrayList<>();
        List<DaywiseTimesheet> currentGroup = new ArrayList<>();

        for (DaywiseTimesheet timesheet : timesheets) {
            if (timesheet.getTimestamp() != null) {
                if (currentGroup.isEmpty() || timestampMatches(timesheet, currentGroup.get(0))) {
                    currentGroup.add(timesheet);
                } else {
                    groupedTimesheets.add(currentGroup);
                    currentGroup = new ArrayList<>();
                    currentGroup.add(timesheet);
                }
            }
        }

        if (!currentGroup.isEmpty()) {
            groupedTimesheets.add(currentGroup);
        }

        return groupedTimesheets;
    }

    // Helper method to check if the timestamps match based on date, hours, and minutes
    private boolean timestampMatches(DaywiseTimesheet timesheet1, DaywiseTimesheet timesheet2) {
        String timestamp1 = String.valueOf(timesheet1.getTimestamp());
        String timestamp2 = String.valueOf(timesheet2.getTimestamp());
        if (timestamp1 != null && timestamp2 != null) {
            return timestamp1.substring(0, 16).equals(timestamp2.substring(0, 16));
        }
        return false;
    }

    @Override
    public void receivedDaywistimesheet(Users user, Date startdate, Date enddate) {
        List<DaywiseTimesheet> timesheetsInRange = daywiseTimesheetRespository.findByUserAndDateBetween(user, startdate, enddate);

        for (DaywiseTimesheet timesheet : timesheetsInRange) {
            if (!"Received".equals(timesheet.getStatus())) {
                timesheet.setStatus("Received");
                timesheet.setDescription("completed");
                Timestamp currentTimestamp = Timestamp.valueOf(LocalDateTime.now());
                timesheet.setTimestamp(currentTimestamp);
                List<EmployeeTimeentries> timeentriesToUpdate = employeeTimeentriesRespository.findByUserAndDate(user, timesheet.getDate());
                for (EmployeeTimeentries timeentry : timeentriesToUpdate) {
                    timeentry.setStatus("Received");
                    timeentry.setTimestamp(currentTimestamp);


                }


                daywiseTimesheetRespository.save(timesheet);
                employeeTimeentriesRespository.saveAll(timeentriesToUpdate);
                daywiseTimesheetRespository.save(timesheet);

            }
        }
    }





}
