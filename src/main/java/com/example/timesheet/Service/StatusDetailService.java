package com.example.timesheet.Service;

import com.example.timesheet.Entity.StatusDetail;

import java.util.List;

public interface StatusDetailService {

    List<StatusDetail> getAllStatusDetails();

    StatusDetail getStatusDetailById(Integer statusID);

    StatusDetail createStatusDetail(StatusDetail statusDetail);

    StatusDetail updateStatusDetail(Integer statusID, StatusDetail statusDetail);

    void deleteStatusDetail(Integer statusID);
}
