package com.izg.back_end.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import com.izg.back_end.dto.UserDto;
import com.izg.back_end.service.UserService;
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
    
<<<<<<< HEAD
    @GetMapping("/get-family") //DB에 저장된 정보 불러오깅
=======
    // 새로운 엔드포인트 추가
    @GetMapping("/get-family")
>>>>>>> c6bdad8fb6b4d87ac1c51529c7b8629e6420712d
	public List<UserModel> getFamily() {
		System.out.println("Gotten all users in my family : " + userService.getFamily());
		return userService.getFamily();
	}
<<<<<<< HEAD
    
//    @GetMapping("/get-family-staus")
//    public List<LogModel> getFamilyStaus(){
//    	return userService.getFamilyStaus();
//    }
//    
=======
>>>>>>> c6bdad8fb6b4d87ac1c51529c7b8629e6420712d
}
