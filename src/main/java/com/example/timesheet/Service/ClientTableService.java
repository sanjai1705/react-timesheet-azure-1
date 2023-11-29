package com.example.timesheet.Service;

import com.example.timesheet.Entity.ClientTable;

import java.util.List;

public interface ClientTableService {
    List<ClientTable> getAllClients();

    ClientTable getClientById(Integer clientId);

    ClientTable createClient(ClientTable clientTable);

    ClientTable updateClient(Integer clientId, ClientTable clientTable);

    void deleteClient(Integer clientId);
}
