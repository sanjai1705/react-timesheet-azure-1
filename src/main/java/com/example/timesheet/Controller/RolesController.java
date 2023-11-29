package com.example.timesheet.Controller;

import com.example.timesheet.Entity.Roles;
import com.example.timesheet.Service.RolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/Timesheet")
public class RolesController {
    @Autowired
    RolesService rolesService;

    @GetMapping("/Roles")
    public ResponseEntity<List<Roles>> getAllRoles() {
        List<Roles> roles = rolesService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/Roles/{roleID}")
    public ResponseEntity<Roles> getRoleById(@PathVariable Integer roleID) {
        Roles roles = rolesService.getRoleById(roleID);
        if (roles != null) {
            return ResponseEntity.ok(roles);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/Roles/Create")
    public ResponseEntity<Roles> createRole(@RequestBody Roles role) {
        Roles createdRole = rolesService.createRole(role);
        return ResponseEntity.ok(createdRole);
    }

    @PutMapping("/Roles/Update/{roleID}")
    public ResponseEntity<Roles> updateRole(@PathVariable Integer roleID, @RequestBody Roles roles) {
        Roles updatedRole = rolesService.updateRole(roleID, roles);
        if (updatedRole != null) {
            return ResponseEntity.ok(updatedRole);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/Roles/Delete/{roleID}")
    public ResponseEntity<Void> deleteRole(@PathVariable Integer roleID) {
        rolesService.deleteRole(roleID);
        return ResponseEntity.noContent().build();
    }

}
