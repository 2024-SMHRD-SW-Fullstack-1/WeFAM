package com.izg.back_end.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;

import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.UserRepository;
import com.izg.back_end.service.UserService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins =  "http://localhost:3000")
@RestController
public class UserController {

	@Autowired
	private UserService userService;

	@GetMapping("/login")
	public ResponseEntity<String> kakaoLogin(@RequestParam("code") String code) {
		
		
		System.out.println("카카오 로그인 요청 수신. code: " + code);

		try {
			// 카카오 서버에 요청을 보내 토큰을 받아옴
			String accessToken = userService.getKakaoAccessToken(code);
			System.out.println("카카오 엑세스 토큰 획득. accessToken: " + accessToken);

			// 액세스 토큰을 사용하여 사용자 정보 받아오기
			UserModel user = userService.getUserInfoFromKakao(accessToken);
			System.out.println("카카오 사용자 정보 획득. user: " + user);

			// 사용자 정보를 데이터베이스에 저장 (또는 업데이트)
			userService.saveUser(user);
			System.out.println("사용자 정보 저장 완료.");

			return ResponseEntity.ok("로그인 성공");

		} catch (Exception e) {
			System.out.println("카카오 로그인 처리 중 오류 발생");
			e.printStackTrace(); // 오류의 자세한 내용을 출력합니다.
			return ResponseEntity.status(500).body("로그인 실패: " + e.getMessage());
		}
	}

	private String getKakaoAccessToken(String code) {
		String tokenUri = "https://kauth.kakao.com/oauth/token";
		RestTemplate restTemplate = new RestTemplate();

		Map<String, String> params = new HashMap<>();
		params.put("grant_type", "authorization_code");
		params.put("client_id", "e8bed681390865b7c0ef4d85e4e2c842");
		params.put("redirect_uri", "http://localhost:3000/login");
		params.put("code", code);

		// 카카오 서버로 요청을 보내어 액세스 토큰을 받아옴
		ResponseEntity<Map> response = restTemplate.postForEntity(tokenUri, params, Map.class);
		Map<String, String> responseBody = (Map<String, String>) response.getBody();

		// 액세스 토큰 반환
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
		Map<String, Object> properties = (Map<String, Object>) responseBody.get("properties");
		Map<String, Object> kakaoAccount = (Map<String, Object>) responseBody.get("kakao_account");

		// 사용자 정보 추출
		UserModel user = new UserModel();
		user.setId(responseBody.get("id").toString());
		user.setName(properties.get("nickname").toString());
		user.setProfileImg(properties.get("profile_image").toString());
		user.setLoginSource("kakao");
		user.setJoinedAt(LocalDateTime.now());

//        // 생일 정보가 존재하는 경우에만 설정
//        if (kakaoAccount.get("birthday") != null) {
//            user.setBirth(LocalDateTime.parse(kakaoAccount.get("birthday").toString()));  // 생일 정보 추가, 필요 시 파싱 방식 조정
//        }

		return user;
	}
}
