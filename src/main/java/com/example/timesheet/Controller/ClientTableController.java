package com.example.timesheet.Controller;

import com.example.timesheet.Entity.ClientTable;
import com.example.timesheet.Service.ClientTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/Timesheet")
public class ClientTableController {

    @Autowired
    ClientTableService clientTableService;
    @GetMapping("/ClientTable")
    public List<ClientTable> getAllClients() {
        return clientTableService.getAllClients();
    }

    @GetMapping("/ClientTable/{clientId}")
    public ClientTable getClientById(@PathVariable Integer clientId) {
        return clientTableService.getClientById(clientId);
    }

    @PostMapping("/ClientTable/Create")
    public ClientTable createClient(@RequestBody ClientTable clientTable) {
        return clientTableService.createClient(clientTable);
    }

    @PutMapping("ClientTable/Update/{clientId}")
    public ClientTable updateClient(@PathVariable Integer clientId, @RequestBody ClientTable client) {
        return clientTableService.updateClient(clientId, client);
    }

    @DeleteMapping("/ClientTable/Delete/{clientId}")
    public void deleteClient(@PathVariable Integer clientId) {
        clientTableService.deleteClient(clientId);
    }

}
