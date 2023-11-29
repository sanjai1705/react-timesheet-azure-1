package com.example.timesheet.Respositories;

import com.example.timesheet.Entity.Roles;
import com.example.timesheet.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsersRespository extends JpaRepository<Users,Integer> {

    Users findByUsernameAndPassword(String username, String password);

    List<Users> findByRoleRoleID(Integer roleId);



}
