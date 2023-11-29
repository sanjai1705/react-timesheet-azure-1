package com.example.timesheet.ServiceImpl;

import com.example.timesheet.Entity.Users;
import com.example.timesheet.Respositories.UsersRespository;
import com.example.timesheet.Service.UsersService;
import jakarta.persistence.NoResultException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersServiceImpl implements UsersService {
    @Autowired
    UsersRespository usersRespository;



    @Override
    public List<Users> getAllUsers() {
        return usersRespository.findAll();
    }

    @Override
    public Users getUserById(Integer userId) {

        return usersRespository.findById(userId).orElse(null);
    }

    @Override
    public Users createUser(Users user) {
        return usersRespository.save(user);
    }

    @Override
    public Users updateUser(Integer userId, Users user) {
        if (usersRespository.existsById(userId)) {
            user.setUserId(userId);
            return usersRespository.save(user);
        }
        return null; // Handle not found case
    }

    @Override
    public void deleteUser(Integer userId) {
        usersRespository.deleteById(userId);
    }
    @Override
    public Users validateUser(String username, String password) {
        try {
            return usersRespository.findByUsernameAndPassword(username, password);
        } catch (NoResultException ex) {
            // Handle the case when no user is found.
            return null;
        }
    }

    @Override
    public List<Users> getUsersByRoleId(Integer roleId) {
        return usersRespository.findByRoleRoleID(roleId);
    }




}
