package com.example.timesheet.ServiceImpl;

import com.example.timesheet.Entity.*;
import com.example.timesheet.Respositories.DaywiseTimesheetRespository;
import com.example.timesheet.Respositories.EmployeeTimeentriesRespository;
import com.example.timesheet.Respositories.StatusDetailRespository;
import com.example.timesheet.Respositories.YearlytableRespository;
import com.example.timesheet.Service.DaywiseTimesheetService;
import com.example.timesheet.Service.EmployeeTimeentriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeTimeentriesServiceImpl implements EmployeeTimeentriesService {
   @Autowired
    EmployeeTimeentriesRespository employeeTimeentriesRespository;
   @Autowired
    DaywiseTimesheetService daywiseTimesheetService;
   @Autowired
    DaywiseTimesheetRespository daywiseTimesheetRespository;
   @Autowired
    StatusDetailRespository statusDetailRespository;
   @Autowired
    YearlytableRespository yearlytableRespository;


    @Override
    public List<EmployeeTimeentries> getAllEmployeeTimeentries() {
        return employeeTimeentriesRespository.findAll();
    }

    @Override
    public EmployeeTimeentries getEmployeeTimeentriesById(Integer timesheetId) {
        return employeeTimeentriesRespository.findById(timesheetId).orElse(null);
    }
    @Override
    public EmployeeTimeentries getEmployeeByUserProjectCreate(EmployeeTimeentries employeeTimeentries){
        List<EmployeeTimeentries> employeeTimeentries1 = employeeTimeentriesRespository.findByUserAndDate(employeeTimeentries.getUser(),employeeTimeentries.getDate());
        Integer minutes = employeeTimeentries.getMinutes()*60;
        if (minutes != null && minutes>0) {

            if (!employeeTimeentries1.isEmpty()) {


                EmployeeTimeentries lastlogout = employeeTimeentries1.get(employeeTimeentries1.size() - 1);
                employeeTimeentries.setLogin(lastlogout.getLogout());

            } else {
                employeeTimeentries.setLogin("09:00");

            }
            employeeTimeentries.setMinutes(minutes);
            LocalTime loginTime = LocalTime.parse(employeeTimeentries.getLogin(), DateTimeFormatter.ofPattern("HH:mm"));
            LocalTime logoutTime = loginTime.plusMinutes(minutes);
            employeeTimeentries.setLogout(logoutTime.format(DateTimeFormatter.ofPattern("HH:mm")));
            // Set the timestamp to the current time
            Timestamp currentTimestamp = Timestamp.valueOf(LocalDateTime.now());
            employeeTimeentries.setTimestamp(currentTimestamp);
            /*Date entryDate = employeeTimeentries.getDate();
            Yearlytable matchingYearlytable = null;
            List<Yearlytable> yearlytables = yearlytableRespository.findAll();

            for (Yearlytable yearlytable : yearlytables) {
                Date startDate = yearlytable.getStartDate();
                Date endDate = yearlytable.getEndDate();



                // Convert entryDate, startDate, and endDate to the same format (e.g., java.util.Date)
                // Assuming they are already in java.util.Date format, no conversion is needed.

                if (entryDate.compareTo(startDate) >= 0 && entryDate.compareTo(endDate) > 0) {
                    matchingYearlytable = yearlytable;
                    System.out.println("Rohit");
                    System.out.println(entryDate);
                    System.out.println(startDate);
                    System.out.println(endDate);
                    break; // Exit the loop once a matching Yearlytable is found
                }
            }

            if (matchingYearlytable != null) {
                System.out.println("hero of zadroit rohit");
                //employeeTimeentries.setYearlytable(matchingYearlytable);



                // Now update the yearlyid in daywisetimesheet with the same date
                Date sameDate = entryDate;
                List<DaywiseTimesheet> daywisetimesheets = daywiseTimesheetRespository.findByDate(sameDate);

                for (DaywiseTimesheet daywisetimesheet : daywisetimesheets) {

                    daywisetimesheet.setYearlytable(matchingYearlytable);
                    daywiseTimesheetRespository.save(daywisetimesheet);

                }
            } else {
                // Handle the case where no Yearlytable matches the date
                return null;

                //throw new IllegalArgumentException("No Yearlytable entry found for the given date.");
            }*/

            DaywiseTimesheet timesheet =  daywiseTimesheetRespository.findByUserAndDate(employeeTimeentries.getUser(), employeeTimeentries.getDate());
            if (timesheet != null && !"Submitted".equals(timesheet.getStatus()) && !"Approved".equals(timesheet.getStatus())) {

                StatusDetail statusdetail = statusDetailRespository.findStatusDetailByUserAndDate(employeeTimeentries.getUser(),employeeTimeentries.getDate());
                statusdetail.setSaveTimestamp(Timestamp.valueOf(LocalDateTime.now()));


                return employeeTimeentriesRespository.save(employeeTimeentries);
            } else if (timesheet==null) {
                StatusDetail statusdetail = new StatusDetail();
                statusdetail.setUser(employeeTimeentries.getUser());
                statusdetail.setDate(employeeTimeentries.getDate());
                Timestamp currentTimestamp1 = Timestamp.valueOf(LocalDateTime.now());
                statusdetail.setSaveTimestamp(currentTimestamp1);

                statusDetailRespository.save(statusdetail);


                return  employeeTimeentriesRespository.save(employeeTimeentries);
            }
            // Handle the case where timesheet status is "Submitted"
            throw new IllegalArgumentException("Cannot create/update time entry for a Submitted or Approved timesheet.");
        }
        return null;
    }




    @Override
    public List<EmployeeTimeentries> getEntriesByUserAndEmployeeAndDate(Users user, ProjectEmployee projectEmployee, Date date) {
        return employeeTimeentriesRespository.findByUserAndProjectEmployeeAndDate(user,projectEmployee,date);
    }


    @Override
    public List<EmployeeTimeentries> getByUserId(Integer userId) {

        return employeeTimeentriesRespository.findByUserUserId(userId);
    }

    @Override
    public List<EmployeeTimeentries> customDate(Users user, Date startdate, Date enddate){
        List<EmployeeTimeentries> customDate = employeeTimeentriesRespository.findByUserAndDateBetween(user, startdate, enddate);
        return customDate;
    }

   /*@Override
    public List<EmployeeTimeentries> customDatee(ProjectEmployee projectEmployee, Users user, Date startdate, Date enddate){
        List<EmployeeTimeentries> projectcustomDate = employeeTimeentriesRespository.findByProjectEmployee(projectEmployee,user,startdate,enddate);
        return projectcustomDate;
    }*/



    @Override
    public void updateRejectedstatus(Users user, Date date) {
        EmployeeTimeentries timeentry = (EmployeeTimeentries) employeeTimeentriesRespository.findByUserAndDate(user,date);

        if (timeentry != null && "rejected".equalsIgnoreCase(timeentry.getStatus())) {
            // Update or delete logic here
            // ...
            timeentry.setStatus(null);
            employeeTimeentriesRespository.save(timeentry);
        }
    }
    @Override
    public EmployeeTimeentries updateEmployeeTimeentries(Integer id, EmployeeTimeentries employeeTimeentries) {
        if (employeeTimeentriesRespository.existsById(id)) {
            employeeTimeentries.setTimesheetId(id);
            /*Date entryDate = employeeTimeentries.getDate();
            Yearlytable matchingYearlytable = null;
            List<Yearlytable> yearlytables = yearlytableRespository.findAll();

            for (Yearlytable yearlytable : yearlytables) {
                Date startDate = yearlytable.getStartDate();
                Date endDate = yearlytable.getEndDate();

                // Convert entryDate, startDate, and endDate to the same format (e.g., java.util.Date)
                // Assuming they are already in java.util.Date format, no conversion is needed.

                if (entryDate.compareTo(startDate) >= 0 && entryDate.compareTo(endDate) > 0) {
                    matchingYearlytable = yearlytable;
                    System.out.println("Rohit");
                    System.out.println(entryDate);
                    System.out.println(startDate);
                    break; // Exit the loop once a matching Yearlytable is found
                }
            }

            if (matchingYearlytable != null) {
                employeeTimeentries.setYearlytable(matchingYearlytable);

                // Now update the yearlyid in daywisetimesheet with the same date
                Date sameDate = entryDate;
                List<DaywiseTimesheet> daywisetimesheets = daywiseTimesheetRespository.findByDate(sameDate);

                for (DaywiseTimesheet daywisetimesheet : daywisetimesheets) {
                    daywisetimesheet.setYearlytable(employeeTimeentries.getYearlytable());
                    daywiseTimesheetRespository.save(daywisetimesheet);
                }
            } else {
                // Handle the case where no Yearlytable matches the date
                return null;

                //throw new IllegalArgumentException("No Yearlytable entry found for the given date.");
            }*/


            // Update the DaywiseTimesheet with the working hours
            DaywiseTimesheet updatedDaywiseTimesheet = daywiseTimesheetService.updateDaywiseTimesheet1(employeeTimeentries);

            // Check if the DaywiseTimesheet was successfully updated
            if (updatedDaywiseTimesheet != null) {
                return employeeTimeentriesRespository.save(employeeTimeentries);
            }
        }
        return null;
    }


    @Override
    public void deleteEmployeeTimeentries(Integer timesheetId) {
        Optional<EmployeeTimeentries> employeeTimeentriesOpt = employeeTimeentriesRespository.findById(timesheetId);

        if (employeeTimeentriesOpt.isPresent()) {
            EmployeeTimeentries employeeTimeentries = employeeTimeentriesOpt.get();
            float timeToSubtract = employeeTimeentries.getMinutes() / 60;

            // Find the associated DaywiseTimesheet
            DaywiseTimesheet daywiseTimesheet = daywiseTimesheetRespository.findByUserAndDate(employeeTimeentries.getUser(), employeeTimeentries.getDate());

            if (daywiseTimesheet != null) {
                // Subtract the time from working hours and total working hours
                float updatedWorkingHours = daywiseTimesheet.getWorkingHours() - timeToSubtract;
                float updatedTotalWorkingHours = updatedWorkingHours + daywiseTimesheet.getOvertime();
                daywiseTimesheet.setWorkingHours(updatedWorkingHours);
                daywiseTimesheet.setTotalWorkingHours(updatedTotalWorkingHours);

                if (daywiseTimesheet.getTotalWorkingHours() == 0) {
                    // Check if time entry is deletable
                    EmployeeTimeentries timeentry = employeeTimeentriesRespository.findById(timesheetId).orElse(null);
                    List<StatusDetail> statusDetail = statusDetailRespository.findByUserAndDate(timeentry.getUser(), timeentry.getDate());
                    if (timeentry != null) {
                        DaywiseTimesheet timesheet = daywiseTimesheetRespository.findByUserAndDate(timeentry.getUser(), timeentry.getDate());

                        if (timesheet != null && !"Submitted".equals(timesheet.getStatus()) && !"Approved".equals(timesheet.getStatus())) {
                            // Delete the time entry and the DaywiseTimesheet if conditions are met

                            employeeTimeentriesRespository.delete(timeentry);
                            daywiseTimesheetRespository.delete(timesheet);

                            for (StatusDetail detail : statusDetail) {
                                statusDetailRespository.delete(detail);
                            }



                            return;
                        }
                    }
                    throw new IllegalArgumentException("Cannot delete the time entry.");
                }

                // Save the updated DaywiseTimesheet
                daywiseTimesheetRespository.save(daywiseTimesheet);
            } else {
                // Handle the case when the associated DaywiseTimesheet is not found
                throw new IllegalArgumentException("DaywiseTimesheet not found for the given time entry.");
            }

            // Delete the EmployeeTimeentries after processing
            employeeTimeentriesRespository.delete(employeeTimeentries);
        } else {
            // Handle the case when the EmployeeTimeentries is not found
            throw new IllegalArgumentException("Time entry not found for the given ID.");
        }
    }







    @Override
    public boolean isLoginLogoutOverlap(EmployeeTimeentries newEntry) {
        //List<EmployeeTimeentries> entriesForSameDate = employeeTimeentriesRespository.findByDate(newEntry.getDate());
        List<EmployeeTimeentries> entriesForSameDate = employeeTimeentriesRespository.findByUserAndDate(newEntry.getUser(),newEntry.getDate());
        for (EmployeeTimeentries existingEntry : entriesForSameDate) {
           if (existingEntry.getLogout() != null && newEntry.getLogin() != null) {
                if (newEntry.getLogin().compareTo(existingEntry.getLogout()) < 0
                        && newEntry.getLogout().compareTo(existingEntry.getLogin()) > 0) {


                    return true;
                }
            }
        }

        return false;
    }
    @Override
    public EmployeeTimeentries saveEmployeeTimeentries(EmployeeTimeentries employeeTimeentries) {
        boolean overlap = isLoginLogoutOverlap(employeeTimeentries);
        if (overlap) {
            return null;
            //throw new IllegalArgumentException("Login and logout times overlap for the same date.");
        } else {
            LocalTime login = LocalTime.parse(employeeTimeentries.getLogin());
            LocalTime logout = LocalTime.parse(employeeTimeentries.getLogout());
            Duration duration = Duration.between(login,logout);
            System.out.println(duration);
            Integer minutes = Math.toIntExact(duration.toMinutes());
            employeeTimeentries.setMinutes(minutes);
            Timestamp currenttimestamp =Timestamp.valueOf(LocalDateTime.now());
            employeeTimeentries.setTimestamp(currenttimestamp);
            /*Date entryDate = employeeTimeentries.getDate();
            Yearlytable matchingYearlytable = null;
            List<Yearlytable> yearlytables = yearlytableRespository.findAll();

            for (Yearlytable yearlytable : yearlytables) {
                Date startDate = yearlytable.getStartDate();
                Date endDate = yearlytable.getEndDate();

                // Convert entryDate, startDate, and endDate to the same format (e.g., java.util.Date)
                // Assuming they are already in java.util.Date format, no conversion is needed.

                if (entryDate.compareTo(startDate) >= 0 && entryDate.compareTo(endDate) <= 0) {
                    matchingYearlytable = yearlytable;
                    System.out.println("Rohit in love");
                    System.out.println(entryDate);
                    System.out.println(startDate);
                    break; // Exit the loop once a matching Yearlytable is found
                }
            }

            if (matchingYearlytable != null) {
                employeeTimeentries.setYearlytable(matchingYearlytable);

                // Now update the yearlyid in daywisetimesheet with the same date
                Date sameDate = entryDate;
                List<DaywiseTimesheet> daywisetimesheets = daywiseTimesheetRespository.findByDate(sameDate);

                for (DaywiseTimesheet daywisetimesheet : daywisetimesheets) {

                    daywiseTimesheetRespository.save(daywisetimesheet);
                }
            } else {
                // Handle the case where no Yearlytable matches the date
                return null;

                //throw new IllegalArgumentException("No Yearlytable entry found for the given date.");
            }*/
            DaywiseTimesheet timesheet = daywiseTimesheetRespository.findByUserAndDate(employeeTimeentries.getUser(), employeeTimeentries.getDate());

            if (timesheet!= null && !"Submitted".equals(timesheet.getStatus()) && !"Approved".equals(timesheet.getStatus())) {
                StatusDetail statusdetail = statusDetailRespository.findStatusDetailByUserAndDate(employeeTimeentries.getUser(),employeeTimeentries.getDate());
                statusdetail.setSaveTimestamp(currenttimestamp);





                return employeeTimeentriesRespository.save(employeeTimeentries);
            } else if (timesheet==null) {
                StatusDetail statusdetail = new StatusDetail();
                statusdetail.setUser(employeeTimeentries.getUser());
                statusdetail.setDate(employeeTimeentries.getDate());
                Timestamp currentTimestamp = Timestamp.valueOf(LocalDateTime.now());
                statusdetail.setSaveTimestamp(currentTimestamp);

                statusDetailRespository.save(statusdetail);





                return employeeTimeentriesRespository.save(employeeTimeentries);
            }
            // Handle the case where timesheet status is "Submitted"
            throw new IllegalArgumentException("Cannot create/update time entry for a Submitted or Approved timesheet.");

        }
    }



    @Override
    public List<EmployeeTimeentries> findByUserIdAndStatusIsNull(Integer userId) {
        Users user = new Users();
        user.setUserId(userId);
        return employeeTimeentriesRespository.findByUserAndStatusIsNull(user);
    }

    @Override
    public void submitTimesheetInRange(Users user, Integer startid, Integer endid) {
        List<EmployeeTimeentries> timesheetsInRange = employeeTimeentriesRespository.findByUserAndTimesheetIdBetween(user,startid,endid);

        for (EmployeeTimeentries employeeTimeentries : timesheetsInRange) {
            if (!"Submitted".equals(employeeTimeentries.getStatus())) {
                employeeTimeentries.setStatus("Submitted");

                // Set the timestamp to the current time
                Timestamp currentTimestamp = Timestamp.valueOf(LocalDateTime.now());
                employeeTimeentries.setTimestamp(currentTimestamp);

                // Update the status in DaywiseTimesheet
                List<DaywiseTimesheet> timeentriesToUpdate = (List<DaywiseTimesheet>) daywiseTimesheetRespository.findByUserAndDate(user, employeeTimeentries.getDate());


                for (DaywiseTimesheet timeentry : timeentriesToUpdate) {
                    timeentry.setStatus("Submitted");
                    timeentry.setTimestamp(currentTimestamp);

                }
                StatusDetail statusdetail = new StatusDetail();
                statusdetail.setUser(employeeTimeentries.getUser());
                statusdetail.setDate(employeeTimeentries.getDate());
                Timestamp currentTimestamp1 = Timestamp.valueOf(LocalDateTime.now());
                statusdetail.setSubmittedTimestamp(currentTimestamp1);
                statusdetail.setSubmittedTimestamp(Timestamp.valueOf(LocalDateTime.now()));
                statusDetailRespository.save(statusdetail);
                daywiseTimesheetRespository.saveAll(timeentriesToUpdate); // Save the updated status in DaywiseTimesheet
                employeeTimeentriesRespository.save(employeeTimeentries); // Save the updated status in EmployeeTimeentries

            }
        }


}

    @Override
    public List<EmployeeTimeentries> findCustomDateByProjectEmployeeAndUserAndDateRange(
            ProjectEmployee projectEmployee, Users user, Date startDate, Date endDate
    ) {
        return employeeTimeentriesRespository.findCustomDateByProjectEmployeeAndUserAndDateRange(
                projectEmployee, user, startDate, endDate
        );
    }






}
