package com.example.timesheet.ServiceImpl;

import com.example.timesheet.Entity.Roles;
import com.example.timesheet.Entity.Users;
import com.example.timesheet.Respositories.RolesRespository;
import com.example.timesheet.Service.RolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RolesServiceImpl implements RolesService {
    @Autowired
    RolesRespository rolesRespository;

    @Override
    public List<Roles> getAllRoles() {
        return rolesRespository.findAll();
    }

    @Override
    public Roles getRoleById(Integer roleID) {
        Optional<Roles> roleOptional = rolesRespository.findById(roleID);
        return roleOptional.orElse(null);
    }

    @Override
    public Roles createRole(Roles roles) {
        return rolesRespository.save(roles);
    }

    @Override
    public Roles updateRole(Integer roleID, Roles roles) {
        if (rolesRespository.existsById(roleID)) {
            roles.setRoleID(roleID);
            return rolesRespository.save(roles);
        }
        return null;
    }

    @Override
    public void deleteRole(Integer roleID) {

        rolesRespository.deleteById(roleID);
    }



}
