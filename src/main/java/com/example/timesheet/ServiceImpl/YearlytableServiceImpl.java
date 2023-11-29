package com.example.timesheet.ServiceImpl;

import com.example.timesheet.Entity.EmployeeTimeentries;
import com.example.timesheet.Entity.Yearlytable;
import com.example.timesheet.Respositories.EmployeeTimeentriesRespository;
import com.example.timesheet.Respositories.YearlytableRespository;
import com.example.timesheet.Service.YearlytableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class YearlytableServiceImpl implements YearlytableService {

    @Autowired
    private YearlytableRespository yearlytableRespository;

    @Autowired
    EmployeeTimeentriesRespository employeeTimeentriesRespository;

    @Override
    public void updateYearlytable(int days) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_YEAR, 1);

        while (calendar.get(Calendar.DAY_OF_YEAR) <= 365) {
            Date startDate = calendar.getTime();
            calendar.add(Calendar.DAY_OF_YEAR, days - 1);
            Date endDate = calendar.getTime();

            Yearlytable yearlytable = new Yearlytable();
            yearlytable.setStartDate(startDate);
            yearlytable.setEndDate(endDate);


            yearlytableRespository.save(yearlytable);

            calendar.add(Calendar.DAY_OF_YEAR, 1); // Move to the next day
        }
    }
   @Override
    public void updateExistingYearlytable(int days) {
        List<Yearlytable> existingYearlytables = yearlytableRespository.findAll();

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_YEAR, 1);

        for (Yearlytable yearlytable : existingYearlytables) {
            Date startDate = calendar.getTime();
            calendar.add(Calendar.DAY_OF_YEAR, days - 1);
            Date endDate = calendar.getTime();

            yearlytable.setStartDate(startDate);
            yearlytable.setEndDate(endDate);



            yearlytableRespository.save(yearlytable);


            calendar.add(Calendar.DAY_OF_YEAR, 1); // Move to the next day
        }
    }






}
