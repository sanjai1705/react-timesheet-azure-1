package com.example.timesheet.Controller;

import com.example.timesheet.Entity.DaywiseTimesheet;
import com.example.timesheet.Entity.EmployeeTimeentries;
import com.example.timesheet.Entity.Project;
import com.example.timesheet.Entity.Users;
import com.example.timesheet.Service.DaywiseTimesheetService;
import com.example.timesheet.Service.EmployeeTimeentriesService;
import com.example.timesheet.Service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/Timesheet")
public class DaywiseTimesheetController {
    @Autowired
    DaywiseTimesheetService daywiseTimesheetService;
    @Autowired
    EmployeeTimeentriesService employeeTimeentriesService;
    @Autowired
    UsersService usersService;

    @GetMapping("/DaywiseTimesheet")
    public List<DaywiseTimesheet> getAllDaywiseTimesheets() {
        return daywiseTimesheetService.getAllDaywiseTimesheets();
    }

    @GetMapping("/DaywiseTimesheet/{id}")
    public DaywiseTimesheet getDaywiseTimesheetById(@PathVariable Integer id) {
        return daywiseTimesheetService.getDaywiseTimesheetById(id);
    }
    @GetMapping("/DaywiseTimesheet/CustomdateTotalworkinghours")
    public ResponseEntity<Float> getCalulateByDateBetween(@RequestParam Users userId,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startdate,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date enddate){
        Float totalworkinghours = daywiseTimesheetService.CalculateByDateBetween(userId,startdate,enddate);
        System.out.println(totalworkinghours);
        return ResponseEntity.ok(totalworkinghours);
    }
    @GetMapping("/DaywiseTimesheet/Customdate")
    public List<DaywiseTimesheet> customDate(@RequestParam Users userId,
                                             @RequestParam  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startdate,
                                             @RequestParam  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date enddate){
        return  daywiseTimesheetService.customDate(userId, startdate, enddate);


    }

    @GetMapping("/DaywiseTimesheet/status")
    public List<DaywiseTimesheet> getBystatuscheck(@RequestParam(name = "status", required = false, defaultValue = "") String status) {

        return daywiseTimesheetService.statuscheck(status);
    }



    @GetMapping("/DaywiseTimesheet/empty-status/user/{userId}")
    public List<DaywiseTimesheet> getDaywiseTimesheetByUserId(@PathVariable Integer userId) {
        return daywiseTimesheetService.findByUserIdAndStatusIsNull(userId);
    }
    @GetMapping("/DaywiseTimesheet/notempty-status/user/{userId}")
    public List<DaywiseTimesheet> getDaywiseTimesheetByUserAndDate(
            @PathVariable Users userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {
        return daywiseTimesheetService.findByUserIdAndStatusIsNotNull(userId, startDate, endDate);
    }



    @PostMapping("/DaywiseTimesheet/submit")
    public ResponseEntity<String> submitTimesheet(@RequestParam Integer userId,
                                                  @RequestParam  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startdate,
                                                  @RequestParam  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date enddate) {
        Users user = usersService.getUserById(Math.toIntExact(userId));
        System.out.println(user);
        if (user == null) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        daywiseTimesheetService.submitTimesheetInRange(user, startdate, enddate);
        System.out.println(daywiseTimesheetService);
        return ResponseEntity.ok("Timesheets submitted successfully");
    }

   @PostMapping("/DaywiseTimesheet/approved")
    public ResponseEntity<String> approveTimesheet(@RequestParam Integer userId,
                                                  @RequestParam  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startdate,
                                                  @RequestParam  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date enddate) {
        Users user = usersService.getUserById(Math.toIntExact(userId));
        System.out.println(user);
        if (user == null) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        daywiseTimesheetService.approveDaywistimesheet(user, startdate, enddate);
        System.out.println(daywiseTimesheetService);
        return ResponseEntity.ok("Timesheets Approved successfully");
    }



    @PostMapping("/DaywiseTimesheet/rejected")
    public ResponseEntity<String> rejectTimesheetInRange(
            @RequestParam Integer userId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam String description) {

        Users user = usersService.getUserById(Math.toIntExact(userId));

                daywiseTimesheetService.rejectTimesheetInRange(user, startDate, endDate, description);

        return ResponseEntity.ok("Timesheets rejected successfully");
    }
    @PostMapping("/DaywiseTimesheet/received")
    public ResponseEntity<String> receivedTimesheet(@RequestParam Integer userId,
                                                   @RequestParam  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startdate,
                                                   @RequestParam  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date enddate) {
        Users user = usersService.getUserById(Math.toIntExact(userId));
        System.out.println(user);
        if (user == null) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        daywiseTimesheetService.receivedDaywistimesheet(user, startdate, enddate);
        System.out.println(daywiseTimesheetService);
        return ResponseEntity.ok("Timesheets Received successfully");
    }

    @PostMapping
    public ResponseEntity<String> addEmployeeTimeEntry(@RequestBody EmployeeTimeentries employeeTimeentries) {
        employeeTimeentriesService.saveEmployeeTimeentries(employeeTimeentries);
        return ResponseEntity.ok("Employee time entry added successfully.");
    }
    @PostMapping("/DaywiseTimesheet/Create")
    public DaywiseTimesheet createDaywiseTimesheet(@RequestBody DaywiseTimesheet daywiseTimesheet) {
        return daywiseTimesheetService.createDaywiseTimesheet(daywiseTimesheet);
    }

    @PutMapping("/DaywiseTimesheet/Update/{id}")
    public DaywiseTimesheet updateDaywiseTimesheet(@PathVariable Integer id, @RequestBody DaywiseTimesheet daywiseTimesheet) {
        return daywiseTimesheetService.updateDaywiseTimesheet(id, daywiseTimesheet);
    }

    /*@PutMapping("/updateRejectedstatus")
    public ResponseEntity<String> updateOrDeleteEntry(@RequestParam Users user, @RequestParam Date date) {
        daywiseTimesheetService.updateRejectedstatus(user, date);
        return ResponseEntity.ok("Entry updated or deleted");
    }*/

    @DeleteMapping("/DaywiseTimesheet/Delete/{id}")
    public void deleteDaywiseTimesheet(@PathVariable Integer id) {

        daywiseTimesheetService.deleteDaywiseTimesheet(id);


    }
    @GetMapping("/DaywiseTimesheet/grouped")
    public List<List<DaywiseTimesheet>> groupTimesheetsByTimestamp() {
        return daywiseTimesheetService.groupTimesheetsByTimestamp();
    }

}






