package com.example.timesheet.Respositories;

import com.example.timesheet.Entity.StatusDetail;
import com.example.timesheet.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface StatusDetailRespository extends JpaRepository<StatusDetail,Integer> {








    List<StatusDetail> findByUserAndDate(Users user, Date date);



    StatusDetail findStatusDetailByUserAndDate(Users user, Date date);
}
