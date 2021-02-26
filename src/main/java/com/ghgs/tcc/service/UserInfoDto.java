package com.ghgs.tcc.service;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(force = true)
@Getter
@EqualsAndHashCode
public class UserInfoDto {

    private String user;
    private String password;
    private String email;
    private String role;
    private String name;
    private String area;

    public static UserInfoDto of(String user, String password, String email, String role, String name, String area) {
        return new UserInfoDto(user, password, email, role, name, area);
    }

}
