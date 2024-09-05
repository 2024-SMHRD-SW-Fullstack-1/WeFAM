package com.izg.back_end.service;

import com.izg.back_end.dto.UserDto;
import com.izg.back_end.model.FileModel;
import com.izg.back_end.model.JoiningModel;
import com.izg.back_end.model.LogModel;
import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.FileRepository;
import com.izg.back_end.repository.JoiningRepository;
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
import java.util.stream.Collectors;

@Service
public class UserService {

<<<<<<< HEAD
   @Autowired
   private UserRepository userRepository;

   @Autowired
   private JoiningRepository joiningRepository;
=======
	
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JoiningRepository joiningRepository;
	
	 @Autowired
	    private FileRepository fileRepository;  // FileRepository 주입
	
>>>>>>> 627da22 (jae)

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
         throw new RuntimeException("엑세스 토큰 얻기 실패");
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

<<<<<<< HEAD
      if (kakaoAccount.get("birthday") != null) {
         String birthday = kakaoAccount.get("birthday").toString();
         int currentYear = LocalDate.now().getYear();
         userDTO.setBirth(
               LocalDate.parse(currentYear + "-" + birthday.substring(0, 2) + "-" + birthday.substring(2)));
      } else {
         userDTO.setBirth(null);
      }
      
       // 액세스 토큰을 DTO에 추가
=======
		if (kakaoAccount.get("birthday") != null) {
			String birthday = kakaoAccount.get("birthday").toString();
			int currentYear = LocalDate.now().getYear();
			userDTO.setBirth(
					LocalDate.parse(currentYear + "-" + birthday.substring(0, 2) + "-" + birthday.substring(2)));
		} else {
			userDTO.setBirth(null);
		}
		
		 // 액세스 토큰을 DTO에 추가
>>>>>>> 627da22 (jae)
        userDTO.setAccessToken(accessToken);

      return userDTO;
   }

<<<<<<< HEAD
   // 유저 정보를 데이터베이스에 저장
   public void saveUser(UserDto userDTO, String accessToken) {
       if (userDTO.getBirth() == null) {
          // 생년월일이 없는 경우 기존 값을 유지 (업데이트하지 않음)
       }
=======
	// 유저 정보를 데이터베이스에 저장
	public void saveUser(UserDto userDTO, String accessToken) {
	    if (userDTO.getBirth() == null) {
	    	// 생년월일이 없는 경우 기존 값을 유지 (업데이트하지 않음)
	    }
>>>>>>> 627da22 (jae)

       // 기존 사용자 확인
       UserModel existingUser = userRepository.findById(userDTO.getId()).orElse(null);

<<<<<<< HEAD
       if (existingUser != null) {
           // 기존 사용자 정보 업데이트 (카카오에서 받은 정보로 업데이트하는 것이 적절한지 확인)
           if(existingUser != null) {
              // 생년월일이 null이 아닌 경우에만 업데이트
              if (userDTO.getBirth() != null) {
                 existingUser.setBirth(userDTO.getBirth());
              }
           }
          
           // 카카오에서 받은 닉네임이 기존 닉네임과 다르다면 업데이트하지 않음
           if (!existingUser.getNick().equals(userDTO.getNick())) {
               existingUser.setNick(existingUser.getNick()); // 기존 닉네임 유지
           } else {
               existingUser.setNick(userDTO.getNick()); // 카카오에서 받은 닉네임으로 업데이트
           }
           
           if (!existingUser.getProfileImg().equals(userDTO.getProfileImg())) {
              existingUser.setProfileImg(existingUser.getProfileImg()); // 
           } else {
              existingUser.setProfileImg(userDTO.getProfileImg()); // 
           }
           
//           // 생년월이이 설정되있으면 그대로 유지
//           if (existingUser.getBirth() == null || userDTO.getBirth() != null) {
//              existingUser.setBirth(userDTO.getBirth());
//           }
           
           // 다른 필드들도 동일하게 필요에 따라 업데이트를 선택
           existingUser.setName(userDTO.getName());
           existingUser.setLoginSource(userDTO.getLoginSource());
           // joined_at 필드는 업데이트하지 않음 (처음 가입된 시간 유지)
       } else {
           // 새로운 사용자 저장
           UserModel newUser = new UserModel();
           newUser.setId(userDTO.getId());
           newUser.setName(userDTO.getName());
           newUser.setNick(userDTO.getNick());
           newUser.setBirth(userDTO.getBirth());
           newUser.setProfileImg(userDTO.getProfileImg());
           newUser.setJoinedAt(userDTO.getJoinedAt());
           newUser.setLoginSource(userDTO.getLoginSource());
         
=======
	    if (existingUser != null) {
	        // 기존 사용자 정보 업데이트 (카카오에서 받은 정보로 업데이트하는 것이 적절한지 확인)
	        if(existingUser != null) {
	        	// 생년월일이 null이 아닌 경우에만 업데이트
	        	if (userDTO.getBirth() != null) {
	        		existingUser.setBirth(userDTO.getBirth());
	        	}
	        }
	    	
	        // 카카오에서 받은 닉네임이 기존 닉네임과 다르다면 업데이트하지 않음
	        if (!existingUser.getNick().equals(userDTO.getNick())) {
	            existingUser.setNick(existingUser.getNick()); // 기존 닉네임 유지
	        } else {
	            existingUser.setNick(userDTO.getNick()); // 카카오에서 받은 닉네임으로 업데이트
	        }
	        if (!existingUser.getName().equals(userDTO.getName())) {
	        	existingUser.setName(existingUser.getName()); // 기존 닉네임 유지
	        } else {
	        	existingUser.setName(userDTO.getName()); // 카카오에서 받은 닉네임으로 업데이트
	        }
	        
	        if (!existingUser.getProfileImg().equals(userDTO.getProfileImg())) {
	        	existingUser.setProfileImg(existingUser.getProfileImg()); // 
	        } else {
	        	existingUser.setProfileImg(userDTO.getProfileImg()); // 
	        }
	        
//	        if (userDTO.getName() != null && !existingUser.getName().equals(userDTO.getName())) {
//	            existingUser.setName(userDTO.getName());
//	        }
//	        // 생년월이이 설정되있으면 그대로 유지
//	        if (existingUser.getBirth() == null || userDTO.getBirth() != null) {
//	        	existingUser.setBirth(userDTO.getBirth());
//	        }
	        
	        // 다른 필드들도 동일하게 필요에 따라 업데이트를 선택
	        existingUser.setName(userDTO.getName());
	        existingUser.setLoginSource(userDTO.getLoginSource());
	        // joined_at 필드는 업데이트하지 않음 (처음 가입된 시간 유지)
	    } else {
	        // 새로운 사용자 저장
	        UserModel newUser = new UserModel();
	        newUser.setId(userDTO.getId());
	        newUser.setName(userDTO.getName());
	        newUser.setNick(userDTO.getNick());
	        newUser.setBirth(userDTO.getBirth());
	        newUser.setProfileImg(userDTO.getProfileImg());
	        newUser.setJoinedAt(userDTO.getJoinedAt());
	        newUser.setLoginSource(userDTO.getLoginSource());
	      
>>>>>>> 627da22 (jae)

           userRepository.save(newUser);
       }

       // 기존 사용자도 업데이트를 진행한 후 저장
       if (existingUser != null) {
           userRepository.save(existingUser);
       }
   }

    public List<UserModel> getUsersInJoining() {
           // Joining 테이블의 모든 항목을 가져옴
           List<JoiningModel> joiningList = joiningRepository.findAll();
           
           // User 테이블에서 user_id와 일치하는 사용자 정보 가져오기
           return joiningList.stream()
                   .map(joining -> userRepository.findById(joining.getUserId()).orElse(null))
                   .filter(user -> user != null)  // null 값 필터링
                   .collect(Collectors.toList());
       }

//   public List<LogModel> getFamilyStaus(){
//      return userRepository.findAll();
//   }
    
    // 닉네임 수정하면 db에 저장하기위한거
    public UserModel updateUserProfile(UserModel updatedUser) {
           // 기존 사용자 정보를 가져와서 업데이트
           UserModel user = userRepository.findById(updatedUser.getId()).orElseThrow(() -> new RuntimeException("User not found"));
           
           user.setName(updatedUser.getName());
           user.setNick(updatedUser.getNick());
           user.setBirth(updatedUser.getBirth());
           user.setProfileImg(updatedUser.getProfileImg());

<<<<<<< HEAD
           return userRepository.save(user);
       }
    
   // 카카오 로그아웃 API 호출
    public void kakaoLogout(String accessToken) {
        String logoutUri = "https://kapi.kakao.com/v1/user/logout";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(logoutUri, HttpMethod.POST, entity, Map.class);

        if (response.getStatusCode() != HttpStatus.OK) {
            throw new RuntimeException("카카오 로그아웃 실패");
        }
    }

=======
	        return userRepository.save(user);
	    }
//	 
//	// 카카오 로그아웃 API 호출
//	 public void kakaoLogout(String accessToken) {
//	     String logoutUri = "https://kapi.kakao.com/v1/user/logout";
//	     RestTemplate restTemplate = new RestTemplate();
//
//	     HttpHeaders headers = new HttpHeaders();
//	     headers.set("Authorization", "Bearer " + accessToken);
//
//	     HttpEntity<String> entity = new HttpEntity<>(headers);
//	     ResponseEntity<Map> response = restTemplate.exchange(logoutUri, HttpMethod.POST, entity, Map.class);
//
//	     if (response.getStatusCode() != HttpStatus.OK) {
//	         throw new RuntimeException("카카오 로그아웃 실패");
//	     }
//	 }

	 // 가족 프로필 사진 가져오기
	    public FileModel getProfileImageByFamilyIdx(int familyIdx, String entityType) {
	        return fileRepository.findLatestByFamilyIdxAndEntityType(familyIdx, entityType);
	    }
	 
	 
>>>>>>> 627da22 (jae)
}
