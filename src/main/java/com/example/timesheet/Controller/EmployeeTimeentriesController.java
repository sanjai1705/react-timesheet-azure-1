package com.example.timesheet.Controller;

import com.example.timesheet.Entity.DaywiseTimesheet;
import com.example.timesheet.Entity.EmployeeTimeentries;
import com.example.timesheet.Entity.ProjectEmployee;
import com.example.timesheet.Entity.Users;
import com.example.timesheet.Respositories.DaywiseTimesheetRespository;
import com.example.timesheet.Respositories.EmployeeTimeentriesRespository;
import com.example.timesheet.Service.DaywiseTimesheetService;
import com.example.timesheet.Service.EmployeeTimeentriesService;
import com.example.timesheet.Service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/Timesheet")
public class EmployeeTimeentriesController {
    @Autowired
    EmployeeTimeentriesService employeeTimeentriesService;

    @Autowired
    EmployeeTimeentriesRespository employeeTimeentriesRespository;

    @Autowired
    DaywiseTimesheetRespository daywiseTimesheetRespository;

    @Autowired
    DaywiseTimesheetService daywiseTimesheetService;
    @Autowired
    DaywiseTimesheetService daywiseTimesheetService1;

    @Autowired
    UsersService usersService;


    @GetMapping("/EmployeeTimeentries")
    public List<EmployeeTimeentries> getAllEmployeeTimeentries() {
        return employeeTimeentriesService.getAllEmployeeTimeentries();
    }

    @GetMapping("/EmployeeTimeentries/{timesheetId}")
    public EmployeeTimeentries getEmployeeTimeentriesById(@PathVariable Integer timesheetId) {
        return employeeTimeentriesService.getEmployeeTimeentriesById(timesheetId);
    }

    @GetMapping("/EmployeeTimeentries/user/{userId}")
    public List<EmployeeTimeentries> getTimeentriesByUserId(@PathVariable Integer userId) {
        List<EmployeeTimeentries> employeeTimeentries =employeeTimeentriesService.getByUserId(userId);
        return employeeTimeentries;
    }

    @GetMapping("/EmployeeTimeentries/Customdate")
    public List<EmployeeTimeentries> customDate(@RequestParam Users userId,
                                             @RequestParam  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startdate,
                                             @RequestParam  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date enddate){
        return  employeeTimeentriesService.customDate(userId, startdate, enddate);


    }
    /*@GetMapping("/EmployeeTimeentries/CustomdateProject")
    public List<EmployeeTimeentries> customDatee(@RequestParam ProjectEmployee empID, @RequestParam Users userId,
                                                       @RequestParam  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startdate,
                                                       @RequestParam  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date enddate){
        return  employeeTimeentriesService.customDatee(empID,userId, startdate, enddate);


    }*/

    @GetMapping("/customdate")
    public List<EmployeeTimeentries> findCustomDate(
            @RequestParam("projectEmployeeId") Integer projectEmployeeId,
            @RequestParam("userId") Integer userId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)Date startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)Date endDate
    ) {
        ProjectEmployee projectEmployee = new ProjectEmployee();
        projectEmployee.setEmpID(projectEmployeeId);

        Users user = new Users();
        user.setUserId(userId);

        return employeeTimeentriesService.findCustomDateByProjectEmployeeAndUserAndDateRange(
                projectEmployee, user, startDate, endDate
        );
    }


    @PostMapping("/EmployeeTimeentries/EmployeeUserProjectCreate")

    public ResponseEntity<String> employeeUserProjectCreate(@RequestBody List<List<EmployeeTimeentries>> employeeTimeentriesLists) {
        List<String> results = new ArrayList<>();

        for (List<EmployeeTimeentries> employeeTimeentriesList : employeeTimeentriesLists) {
            for (EmployeeTimeentries employeeTimeentries : employeeTimeentriesList) {
                EmployeeTimeentries result = employeeTimeentriesService.getEmployeeByUserProjectCreate(employeeTimeentries);

                if (result != null) {
                    daywiseTimesheetService.updateDaywiseTimesheet1(employeeTimeentries);
                    results.add("EmployeeTimeentries created");
                } else {
                    results.add("Not Saved");
                }
            }
        }


        if (results.contains("Not Saved")) {
            return ResponseEntity.ok("Some entries were not saved.");
        } else {
            return ResponseEntity.ok("All entries created successfully.");
        }
    }

    @GetMapping("/EmployeeTimeentries/empty-status/user/{userId}")
    public List<EmployeeTimeentries> getDaywiseTimesheetByUserId(@PathVariable Integer userId) {
        return employeeTimeentriesService.findByUserIdAndStatusIsNull(userId);
    }



    @PostMapping("/EmployeeTimeentries/EmployeeUserProjectCreate1")
    public ResponseEntity<String> employeeUserProjectCreate1(@RequestBody List<EmployeeTimeentries> employeeTimeentries) {
        List<String> results = new ArrayList<>();

        for (EmployeeTimeentries employeeTimeentries1 : employeeTimeentries) {
            EmployeeTimeentries result = employeeTimeentriesService.getEmployeeByUserProjectCreate(employeeTimeentries1);

            if (result != null) {
                daywiseTimesheetService.updateDaywiseTimesheet1(employeeTimeentries1);
                results.add("EmployeeTimeentries created");
            } else {
                results.add("Not Saved");
            }
        }

        if (results.contains("Not Saved")) {
            return ResponseEntity.ok("Some entries were not saved.");
        } else {
            return ResponseEntity.ok("All entries created successfully.");
        }
    }



    @PostMapping("/EmployeeTimeentries/Create")
    public ResponseEntity<String> validateAndSaveEmployeeTimeentry(@RequestBody EmployeeTimeentries employeeTimeentries) {

        EmployeeTimeentries savedEntry = employeeTimeentriesService.saveEmployeeTimeentries(employeeTimeentries);

        if(savedEntry!=null)
        {

            daywiseTimesheetService.updateDaywiseTimesheet1(employeeTimeentries);
            return ResponseEntity.ok("EmployeeTimeentry saved successfully.");
        }
        else {
            return ResponseEntity.ok("Not Saved");
        }

    }
    @PostMapping("/EmployeeTimeentries/UpdatedRejectedStatus")
    public void updateOrDeleteEntry(@RequestParam Users user,@RequestParam  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date) {
        EmployeeTimeentries timeentry = (EmployeeTimeentries) employeeTimeentriesRespository.findByUserAndDate(user,date);

        if (timeentry != null && "rejected".equalsIgnoreCase(timeentry.getStatus())) {

            DaywiseTimesheet daywiseTimesheet = (DaywiseTimesheet) daywiseTimesheetRespository.findByUserAndDate(user,date);
            if (daywiseTimesheet != null) {
                daywiseTimesheet.setStatus(null);
                daywiseTimesheet.setDescription("completed");
                daywiseTimesheetRespository.save(daywiseTimesheet);
            }


            timeentry.setStatus(null);
            employeeTimeentriesRespository.save(timeentry);
        }
    }

    @PutMapping("/EmployeeTimeentries/Update/{id}")
    public ResponseEntity<EmployeeTimeentries> updateEmployeeTimeentries(
            @PathVariable Integer id,
            @RequestBody EmployeeTimeentries employeeTimeentries
    ) {
        EmployeeTimeentries updatedEmployeeTimeentries = employeeTimeentriesService.updateEmployeeTimeentries(id, employeeTimeentries);

        if (updatedEmployeeTimeentries != null) {
            daywiseTimesheetService.updateDaywiseTimesheet1(employeeTimeentries);
            return ResponseEntity.ok(updatedEmployeeTimeentries);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/EmployeeTimeentries/Delete/{timesheetId}")
    public ResponseEntity<Void> deleteEmployeeTimeentries(@PathVariable Integer timesheetId) {



        employeeTimeentriesService.deleteEmployeeTimeentries(timesheetId);






        return ResponseEntity.noContent().build();
    }

    @PostMapping("/EmployeeTimeentries/submit")
    public ResponseEntity<String> submitTimesheetInRange(
            @RequestParam Integer userId,
            @RequestParam Integer startId,
            @RequestParam Integer endId) {

        Users user = usersService.getUserById(userId);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        employeeTimeentriesService.submitTimesheetInRange(user, startId, endId);

        return new ResponseEntity<>("Timesheets submitted successfully", HttpStatus.OK);
    }

}
