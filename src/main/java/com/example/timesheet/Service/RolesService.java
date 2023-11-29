package com.example.timesheet.Service;

import com.example.timesheet.Entity.Roles;

import java.util.List;

public interface RolesService {

    List<Roles> getAllRoles();
    Roles getRoleById(Integer roleID);
    Roles createRole(Roles roles);
    Roles updateRole(Integer roleID, Roles roles);
    void deleteRole(Integer roleID);

}
