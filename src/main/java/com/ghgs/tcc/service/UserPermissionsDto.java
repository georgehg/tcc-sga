package com.ghgs.tcc.service;

import lombok.*;

import java.util.Arrays;
import java.util.List;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(force = true)
@Getter
@EqualsAndHashCode
public class UserPermissionsDto {

    private List<String> roles;

    public static UserPermissionsDto build(String... roles) {
        return new UserPermissionsDto(Arrays.asList(roles));
    }

}
