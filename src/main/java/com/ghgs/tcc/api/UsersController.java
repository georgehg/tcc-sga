package com.ghgs.tcc.api;

import com.ghgs.tcc.service.UserInfoDto;
import com.ghgs.tcc.service.UserPermissionsDto;
import com.ghgs.tcc.service.UsersService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/users")
public class UsersController {

    private UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @PostMapping(
            path = "/authenticate",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserInfoDto> authenticate(@RequestBody UserCredentials credentials) {
        return ResponseEntity.ok(usersService.authenticateUser(credentials));
    }

    @GetMapping(
            path = "/permissions",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserPermissionsDto> getUserPermissions(@RequestParam("role") String role) {
        return ResponseEntity.ok(usersService.getUserPermissions(role));
    }

}
