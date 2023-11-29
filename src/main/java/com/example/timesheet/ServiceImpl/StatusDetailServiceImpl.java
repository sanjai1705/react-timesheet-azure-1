package com.example.timesheet.ServiceImpl;

import com.example.timesheet.Entity.StatusDetail;
import com.example.timesheet.Respositories.StatusDetailRespository;
import com.example.timesheet.Service.StatusDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatusDetailServiceImpl implements StatusDetailService {
    @Autowired
    StatusDetailRespository statusDetailRespository;

    @Override
    public List<StatusDetail> getAllStatusDetails() {

        return statusDetailRespository.findAll();
    }

    @Override
    public StatusDetail getStatusDetailById(Integer statusID) {
        return statusDetailRespository.findById(statusID).orElse(null);
    }

    @Override
    public StatusDetail createStatusDetail(StatusDetail statusDetail) {
        return statusDetailRespository.save(statusDetail);
    }

    @Override
    public StatusDetail updateStatusDetail(Integer statusID, StatusDetail statusDetail) {
        if (statusDetailRespository.existsById(statusID)) {
            statusDetail.setStatusID(statusID);
            return statusDetailRespository.save(statusDetail);
        } else {
            return null;
        }
    }

    @Override
    public void deleteStatusDetail(Integer statusID) {
        statusDetailRespository.deleteById(statusID);
    }
}
