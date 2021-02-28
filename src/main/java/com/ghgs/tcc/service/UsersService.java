package com.ghgs.tcc.service;

import com.ghgs.tcc.api.UserCredentials;
import org.springframework.stereotype.Service;

@Service
public class UsersService {

    public UserInfoDto authenticateUser(UserCredentials credentials) {
        return UserInfoDto.of(credentials.getUser(), credentials.getPassword(), "contact@info.com",
                "admin", "George Silva", "ambiental");
    }

    public UserPermissionsDto getUserPermissions(String role) {
        return UserPermissionsDto.build("policies", "incidents");
    }
}
