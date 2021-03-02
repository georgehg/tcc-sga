package com.ghgs.tcc.service;

import lombok.*;

import java.util.Arrays;
import java.util.List;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PRIVATE, force = true)
@Getter
@EqualsAndHashCode
public class UserPermissionsDto {

    private final List<UserRolesDto> roles;

    public static UserPermissionsDto build(UserRolesDto... roles) {
        return new UserPermissionsDto(Arrays.asList(roles));
    }

    @AllArgsConstructor(staticName = "of")
    @NoArgsConstructor(access = AccessLevel.PRIVATE, force = true)
    @Getter
    public static class UserRolesDto {
        private final String name;
        private final List<String> privileges;
    }

}
