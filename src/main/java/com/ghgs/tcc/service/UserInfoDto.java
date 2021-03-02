package com.ghgs.tcc.service;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor(staticName = "of")
@NoArgsConstructor(access = AccessLevel.PRIVATE, force = true)
@Getter
@EqualsAndHashCode
public class UserInfoDto {

    private final String user;
    private final String password;
    private final String email;
    private final String role;
    private final String name;
    private final String area;

}
