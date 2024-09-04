package com.izg.back_end.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import com.izg.back_end.dto.UserDto;
import com.izg.back_end.service.FamilyService;
import com.izg.back_end.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import com.izg.back_end.model.FamilyModel;
import com.izg.back_end.model.FeedModel;
import com.izg.back_end.model.LogModel;
import com.izg.back_end.model.UserModel;

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
    
    // 로그아웃 엔드포인트
    
    @PostMapping("/logout")
    @CrossOrigin(methods = { RequestMethod.POST }) // 이 엔드포인트도 POST만 허용
    public ResponseEntity<Void> logout(HttpSession session, HttpServletResponse response) {
        session.invalidate(); // 세션 무효화
     // 쿠키 무효화
        Cookie cookie = new Cookie("JSESSIONID", null); // JSESSIONID 쿠키 삭제
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0); // 쿠키 만료
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }
    
    // 가족만 보여주기
    @GetMapping("/get-family")
    public List<UserModel> getFamily() {
        return userService.getUsersInJoining();
    }
//    @GetMapping("/get-family-staus")
//    public List<LogModel> getFamilyStaus(){
//    	return userService.getFamilyStaus();
//    }
//    
 // 프로필 업데이트를 위한 엔드포인트 추가
    @PutMapping("/update-profile")
    public ResponseEntity<UserModel> updateProfile(@RequestBody UserModel updatedUser) {
        try {
            // 서비스 레이어에서 유저 프로필 업데이트
            UserModel savedUser = userService.updateUserProfile(updatedUser);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    
}
