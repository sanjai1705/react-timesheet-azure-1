package com.example.timesheet.Controller;

import com.example.timesheet.Entity.FlagCheck;
import com.example.timesheet.Service.FlagCheckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/Timesheet")
public class FlagCheckController {

    @Autowired
    FlagCheckService flagCheckService;
    @GetMapping("/Flagcheck")
    public List<FlagCheck> getAllFlagCheck(){
        return flagCheckService.getAllFlagCheck();
    }
    @GetMapping("/Flagcheck/{checkId}")
    public FlagCheck getAllFlagCheckBYId(@PathVariable Integer checkId){
        return flagCheckService.getFlagCheckBYId(checkId);
    }
    @PostMapping("/Flagcheck/Create")
    public FlagCheck CreateFlagCheck(@RequestBody FlagCheck flagCheck){
        return flagCheckService.createFlagCheck(flagCheck);
    }

    @PutMapping("/Flagcheck/Update/{checkId}")
    public FlagCheck updateFlagCheck(@PathVariable Integer checkId,@RequestBody FlagCheck flagCheck){
        return flagCheckService.updateFlagCheck(checkId,flagCheck);

    }
    @DeleteMapping("/Flagcheck/{checkId}")
    public FlagCheck deleteBYFlagCheckId(@PathVariable Integer checkId){

        flagCheckService.deleteFlagCheck(checkId);
        return null;

    }

}
