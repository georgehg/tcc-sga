package com.ghgs.tcc.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ghgs.tcc.service.UserInfoDto;
import com.ghgs.tcc.service.UserPermissionsDto;
import com.ghgs.tcc.service.UsersService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(UsersController.class)
@AutoConfigureMockMvc
public class UsersControllerTest {

    private static final String USER_DIR = System.getProperty("user.dir");
    private static final File JSON_INPUT_FILE = new File(USER_DIR + "/src/test/resources/json/user-credentials.json");

    @Autowired
    private MockMvc mvc;

    @MockBean
    private UsersService usersService;

    @Test
    public void givenUsersCredentials_AuthenticateUser() throws Exception {
        UserCredentials credentials = new ObjectMapper().readValue(JSON_INPUT_FILE, UserCredentials.class);
        UserInfoDto userInfo = UserInfoDto.of(credentials.getUser(), credentials.getPassword(), "contact@info.com",
                "admin", "George Silva", "ambiental");

        when(usersService.authenticateUser(credentials)).thenReturn(userInfo);

        mvc.perform(post("/sga/api/v1/users/authenticate")
                .contextPath("/sga/api/v1")
                .content(Files.readAllBytes(JSON_INPUT_FILE.toPath()))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user", equalTo("gsilva")))
                .andExpect(jsonPath("$.password", equalTo("admin123")))
                .andExpect(jsonPath("$.email", equalTo("contact@info.com")))
                .andExpect(jsonPath("$.role", equalTo("admin")))
                .andExpect(jsonPath("$.name", equalTo("George Silva")))
                .andExpect(jsonPath("$.area", equalTo("ambiental")));
    }

    @Test
    public void givenUserRole_ReturnUserPermissions() throws Exception {
        String role = "admin";
        List<String> permissions = Arrays.asList("policies");

        when(usersService.getUserPermissions(role)).thenReturn(
                UserPermissionsDto.build(permissions.stream().toArray(String[]::new)));

        mvc.perform(get("/sga/api/v1/users/permissions?role=" + "admin")
                .contextPath("/sga/api/v1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roles[0]", equalTo(permissions.get(0))));
    }

}
