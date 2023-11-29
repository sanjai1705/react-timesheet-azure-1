package com.example.timesheet.ServiceImpl;

import ch.qos.logback.core.net.server.Client;
import com.example.timesheet.Entity.ClientTable;
import com.example.timesheet.Respositories.ClientTableRespository;
import com.example.timesheet.Service.ClientTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientTableServiceImpl implements ClientTableService {
    @Autowired
    ClientTableRespository clientTableRespository;
    @Override
    public List<ClientTable> getAllClients() {
        return clientTableRespository.findAll();
    }

    @Override
    public ClientTable getClientById(Integer clientId) {
        Optional<ClientTable> client = clientTableRespository.findById(clientId);
        return client.orElse(null);
    }

    @Override
    public ClientTable createClient(ClientTable clientTable) {
        return clientTableRespository.save(clientTable);
    }

    @Override
    public ClientTable updateClient(Integer clientId, ClientTable clientTable) {
        if (clientTableRespository.existsById(clientId)) {
            clientTable.setClientId(clientId); // Make sure the client object has the correct ID
            return clientTableRespository.save(clientTable);
        }
        return null; // Client with the given ID doesn't exist
    }

    @Override
    public void deleteClient(Integer clientId) {
        clientTableRespository.deleteById(clientId);
    }


}
