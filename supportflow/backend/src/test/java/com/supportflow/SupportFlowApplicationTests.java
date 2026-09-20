package com.supportflow;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class SupportFlowApplicationTests {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void contextLoads() {
        String hash = passwordEncoder.encode("password123");
        System.out.println("====== BCRYPT HASH FOR password123 ======");
        System.out.println(hash);
        System.out.println("=========================================");
    }
}
