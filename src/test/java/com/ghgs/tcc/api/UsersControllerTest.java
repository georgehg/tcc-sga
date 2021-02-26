package com.ghgs.tcc.api;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;
import java.nio.file.Files;

import static org.hamcrest.Matchers.equalTo;
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

    @Test
    public void givenUsersCredentials_AuthenticateUser() throws Exception {
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

}
