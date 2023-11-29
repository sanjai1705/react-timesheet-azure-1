package com.example.timesheet.Service;

import com.example.timesheet.Entity.FlagCheck;
import com.example.timesheet.Entity.StatusDetail;

import java.util.List;

public interface FlagCheckService {


    List<FlagCheck> getAllFlagCheck();
    FlagCheck getFlagCheckBYId(Integer checkId);
    FlagCheck createFlagCheck(FlagCheck flagCheck);
    FlagCheck updateFlagCheck(Integer checkId,FlagCheck flagCheck);
    void deleteFlagCheck(Integer checkId);


}
