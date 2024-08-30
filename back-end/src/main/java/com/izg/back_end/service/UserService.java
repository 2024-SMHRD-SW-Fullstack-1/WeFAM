package com.izg.back_end.service;

import com.izg.back_end.dto.UserDto;
import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
@Service
public class UserService {

   @Autowired
   private UserRepository userRepository;

   // 인가 코드를 사용하여 액세스 토큰을 가져옴
   public String getKakaoAccessToken(String code) {
      String tokenUri = "https://kauth.kakao.com/oauth/token";
      RestTemplate restTemplate = new RestTemplate();

      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

      MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
      params.add("grant_type", "authorization_code");
      params.add("client_id", "e8bed681390865b7c0ef4d85e4e2c842"); // 여기에 실제 카카오 REST API 키를 입력하세요
      params.add("redirect_uri", "http://localhost:3000");
      params.add("code", code);

      HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
      ResponseEntity<Map> response = restTemplate.postForEntity(tokenUri, request, Map.class);

      if (response.getStatusCode() == HttpStatus.OK) {
         Map<String, Object> responseBody = response.getBody();
         return responseBody != null ? (String) responseBody.get("access_token") : null;
      } else {
         throw new RuntimeException("Failed to get access token");
      }
   }

   // 카카오 서버에서 유저 정보를 받아옴
   public UserDto getUserInforFromKakao(String accessToken) {
      String userInfoUri = "https://kapi.kakao.com/v2/user/me";
      RestTemplate restTemplate = new RestTemplate();

      HttpHeaders headers = new HttpHeaders();
      headers.set("Authorization", "Bearer " + accessToken);

      HttpEntity<String> entity = new HttpEntity<>(headers);
      ResponseEntity<Map> response = restTemplate.exchange(userInfoUri, HttpMethod.GET, entity, Map.class);

      Map<String, Object> responseBody = response.getBody();
      if (responseBody == null) {
         throw new RuntimeException("Failed to get user info from Kakao");
      }

      Map<String, Object> properties = (Map<String, Object>) responseBody.get("properties");
      Map<String, Object> kakaoAccount = (Map<String, Object>) responseBody.get("kakao_account");

      UserDto userDTO = new UserDto();
      userDTO.setId(responseBody.get("id").toString());
      userDTO.setName(properties.get("nickname").toString());
      userDTO.setNick(properties.get("nickname").toString());
      userDTO.setProfileImg(properties.get("profile_image").toString());
      userDTO.setLoginSource("kakao");
      userDTO.setJoinedAt(LocalDateTime.now());
        

      if (kakaoAccount.get("birthday") != null) {
         String birthday = kakaoAccount.get("birthday").toString();
         int currentYear = LocalDate.now().getYear();
         userDTO.setBirth(
               LocalDate.parse(currentYear + "-" + birthday.substring(0, 2) + "-" + birthday.substring(2)));
      }

      return userDTO;
   }

    // 유저 정보를 데이터베이스에 저장
    public void saveUser(UserDto userDTO) {
        if (userDTO.getBirth() == null) {
            userDTO.setBirth(LocalDate.now()); // 기본값 설정 또는 예외 처리
        }

      UserModel user = new UserModel();
      user.setId(userDTO.getId());
      user.setName(userDTO.getName());
      user.setNick(userDTO.getNick());
      user.setBirth(userDTO.getBirth());
      user.setProfileImg(userDTO.getProfileImg());
      user.setJoinedAt(userDTO.getJoinedAt());
      user.setLoginSource(userDTO.getLoginSource());

      userRepository.save(user);
   }
   
   public List<UserModel> getFamily(){
      return userRepository.findAll();
   }
   
//   public List<LogModel> getFamilyStaus(){
//      return userRepository.findAll();
//   }

   
}
