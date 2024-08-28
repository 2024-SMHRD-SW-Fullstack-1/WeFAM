package com.izg.back_end.service;

import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String getKakaoAccessToken(String code) {
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

    public UserModel getUserInfoFromKakao(String accessToken) {
        String userInfoUri = "https://kapi.kakao.com/v2/user/me";
        RestTemplate restTemplate = new RestTemplate();

        // 헤더에 Authorization 추가
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(userInfoUri, HttpMethod.GET, entity, Map.class);
        
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        Map<String, Object> properties = (Map<String, Object>) responseBody.get("properties");
        Map<String, Object> kakaoAccount = (Map<String, Object>) responseBody.get("kakao_account");

        // 사용자 정보 추출 및 UserModel 객체에 설정
        UserModel user = new UserModel();
        user.setId(responseBody.get("id").toString());
        user.setName(properties.get("nickname").toString());
        user.setProfileImg(properties.get("profile_image").toString());
        user.setLoginSource("kakao");
        user.setJoinedAt(LocalDate.now().atStartOfDay()); // LocalDateTime으로 변환
        // 생일 정보가 존재하는 경우에만 설정
        if (kakaoAccount.get("birthday") != null) {
            user.setBirth(LocalDate.parse(kakaoAccount.get("birthday").toString())); // 파싱 방식 조정 필요
        }

        return user;
    }

    public void saveUser(UserModel user) {
        userRepository.save(user);
    }
}
