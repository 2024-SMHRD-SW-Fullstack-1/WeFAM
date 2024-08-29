package com.izg.back_end.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.UserRepository;

import java.net.http.HttpHeaders;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<String> kakaoLogin(@RequestBody Map<String, String> requestBody) {
        String code = requestBody.get("code");

        // 카카오 서버에 요청을 보내 토큰을 받아옴
        String accessToken = getKakaoAccessToken(code);

        // 액세스 토큰을 사용하여 사용자 정보 받아오기
        UserModel user = getUserInfoFromKakao(accessToken);

        // 사용자 정보를 데이터베이스에 저장 (또는 업데이트)
        userRepository.save(user);

        return ResponseEntity.ok("로그인 성공");
    }

    private String getKakaoAccessToken(String code) {
        String tokenUri = "https://kauth.kakao.com/oauth/token";
        RestTemplate restTemplate = new RestTemplate();

        Map<String, String> params = new HashMap<>();
        params.put("grant_type", "authorization_code");
        params.put("client_id", "e8bed681390865b7c0ef4d85e4e2c842");
        params.put("redirect_uri", "http://localhost:3000/login");
        params.put("code", code);

        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUri, params, Map.class);
        Map<String, String> responseBody = (Map<String, String>) response.getBody();

        return responseBody.get("access_token");
    }

    private UserModel getUserInfoFromKakao(String accessToken) {
        String userInfoUri = "https://kapi.kakao.com/v2/user/me";
        RestTemplate restTemplate = new RestTemplate();

        // 헤더에 Authorization 추가
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(userInfoUri, HttpMethod.GET, entity, Map.class);
        
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        
        // 사용자 정보 추출
        UserModel user = new UserModel();
        user.setId(responseBody.get("id").toString());
        user.setName(responseBody.get("properties").get("nickname").toString());
        user.setProfileImg(responseBody.get("properties").get("profile_image").toString());
        user.setLoginSource("kakao");
        user.setJoinedAt(LocalDateTime.now());
        
        return user;
    }
}
