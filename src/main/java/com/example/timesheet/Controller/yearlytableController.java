package com.example.timesheet.Controller;

import com.example.timesheet.Service.YearlytableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins="http://localhost:3000")
@RestController

public class yearlytableController {

    @Autowired
    private YearlytableService yearlytableService;

    @PostMapping("/updateYearlytable")
    public void updateYearlytable(@RequestParam int days) {

        yearlytableService.updateYearlytable(days);
    }
    @PostMapping("/updateExistingtable")
    public void updateExistingtable(@RequestParam int days) {
        yearlytableService.updateExistingYearlytable(days);
    }


}
