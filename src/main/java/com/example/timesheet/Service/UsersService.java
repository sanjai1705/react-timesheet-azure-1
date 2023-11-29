package com.example.timesheet.Service;

import com.example.timesheet.Entity.Users;

import java.util.List;

public interface UsersService {
    List<Users> getAllUsers();
    Users getUserById(Integer userId);
    Users createUser(Users user);
    Users updateUser(Integer userId, Users user);
    void deleteUser(Integer userId);


    Users validateUser(String username, String password);

    List<Users> getUsersByRoleId(Integer roleId);


}
