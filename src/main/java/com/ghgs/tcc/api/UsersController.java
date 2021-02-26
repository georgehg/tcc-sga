package com.ghgs.tcc.api;

import com.ghgs.tcc.service.UserInfoDto;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/users")
public class UsersController {

    @PostMapping(
            path = "/authenticate",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserInfoDto> authenticate(@RequestBody Map<String, String> credentials) {
        return ResponseEntity.ok(
                UserInfoDto.of(credentials.get("user"), credentials.get("password"), "contact@info.com",
                        "admin", "George Silva", "ambiental"));
    }

}
