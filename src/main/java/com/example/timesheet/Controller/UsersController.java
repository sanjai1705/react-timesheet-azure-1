package com.example.timesheet.Controller;

import com.example.timesheet.Entity.Users;
import com.example.timesheet.Service.UsersService;

import com.example.timesheet.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins="http://localhost:3000")
@RequestMapping("/Timesheet")
public class UsersController {
    @Autowired
    UsersService usersService;

    @GetMapping("/Users")
    public List<Users> getAllUsers() {
        return usersService.getAllUsers();
    }

    @GetMapping("/Users/{userId}")
    public Users getUserById(@PathVariable Integer userId) {

        return usersService.getUserById(userId);
    }
    @GetMapping("/usersByRoleId")
    public List<Integer> getUsersByRoleId(@RequestParam Integer roleId) {
        List<Users> users = usersService.getUsersByRoleId(roleId);

        return users.stream().map(Users::getUserId).collect(Collectors.toList());
    }




    @PostMapping("/Users/Create")
    public Users createUser(@RequestBody Users user) {
        return usersService.createUser(user);
    }

    @PutMapping("/Users/Update/{userId}")
    public Users updateUser(@PathVariable Integer userId, @RequestBody Users user) {
        return usersService.updateUser(userId, user);
    }

    @DeleteMapping("/Users/Delete/{userId}")
    public void deleteUser(@PathVariable Integer userId) {
        usersService.deleteUser(userId);
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Users users) {
        Users user = usersService.validateUser(users.getUsername(),users.getPassword());

        if (user != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("userid", user.getUserId());
            response.put("Rolename", user.getRole().getRoleName());

            return ResponseEntity.ok(response);

        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


    }
