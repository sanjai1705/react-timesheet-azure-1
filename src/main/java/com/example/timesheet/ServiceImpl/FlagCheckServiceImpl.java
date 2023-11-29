package com.example.timesheet.ServiceImpl;

import com.example.timesheet.Entity.FlagCheck;
import com.example.timesheet.Respositories.FlagCheckRespository;
import com.example.timesheet.Service.FlagCheckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlagCheckServiceImpl implements FlagCheckService {

    @Autowired
    FlagCheckRespository flagCheckRespository;
    @Override
    public List<FlagCheck> getAllFlagCheck() {
        return flagCheckRespository.findAll() ;
    }

    @Override
    public FlagCheck getFlagCheckBYId(Integer checkId) {
        return flagCheckRespository.findById(checkId).orElse(null);
    }

    @Override
    public FlagCheck createFlagCheck(FlagCheck flagCheck) {
        return flagCheckRespository.save(flagCheck);
    }

    @Override
    public FlagCheck updateFlagCheck(Integer checkId, FlagCheck flagCheck) {
        if(flagCheckRespository.existsById(checkId)){
            flagCheck.setCheckId(checkId);
            return flagCheckRespository.save(flagCheck);
        }else {
            return null;
        }
    }

    @Override
    public void deleteFlagCheck(Integer checkId) {
        flagCheckRespository.deleteById(checkId);

    }
}
