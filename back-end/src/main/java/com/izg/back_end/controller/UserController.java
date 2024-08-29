package com.izg.back_end.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import com.izg.back_end.dto.UserDto;
import com.izg.back_end.service.UserService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Object> kakaoLogin(@RequestBody String code) {
        System.out.println("카카오 로그인 요청 수신. 인가 코드: " + code);
        try {
            // 인가 코드를 사용해 액세스 토큰을 얻음
            String accessToken = userService.getKakaoAccessToken(code);

            // 액세스 토큰을 이용해 사용자 정보 가져오기
            UserDto userDTO = userService.getUserInforFromKakao(accessToken);

            // 유저 정보를 데이터베이스에 저장
            userService.saveUser(userDTO);

            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            System.out.println("카카오 로그인 처리 중 오류 발생");
            e.printStackTrace();
            return ResponseEntity.status(500).body("로그인 실패: " + e.getMessage());
        }
    }
    
    
}
