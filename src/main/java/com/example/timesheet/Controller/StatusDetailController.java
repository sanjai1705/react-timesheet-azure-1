package com.example.timesheet.Controller;

import com.example.timesheet.Entity.StatusDetail;
import com.example.timesheet.Service.StatusDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/Timesheet")
public class StatusDetailController {
    @Autowired
    StatusDetailService statusDetailService;
    @GetMapping("/StatusDetail")
    public List<StatusDetail> getAllStatusDetails() {
        return statusDetailService.getAllStatusDetails();
    }

    @GetMapping("/StatusDetail/{statusID}")
    public StatusDetail getStatusDetailById(@PathVariable Integer statusID) {
        return statusDetailService.getStatusDetailById(statusID);
    }

    @PostMapping("/StatusDetail/Create")
    public StatusDetail createStatusDetail(@RequestBody StatusDetail statusDetail) {
        return statusDetailService.createStatusDetail(statusDetail);
    }

    @PutMapping("/StatusDetail/{statusID}")
    public StatusDetail updateStatusDetail(@PathVariable Integer statusID, @RequestBody StatusDetail statusDetail) {
        return statusDetailService.updateStatusDetail(statusID, statusDetail);
    }

    @DeleteMapping("/StatusDetail/{statusID}")
    public void deleteStatusDetail(@PathVariable Integer statusID) {
        statusDetailService.deleteStatusDetail(statusID);
    }

}
