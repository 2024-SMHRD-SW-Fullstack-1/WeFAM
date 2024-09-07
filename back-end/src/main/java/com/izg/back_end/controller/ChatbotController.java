package com.izg.back_end.controller;

import java.util.ArrayList;
import java.util.List;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.izg.back_end.model.ChatbotCompletionRequest;
import com.izg.back_end.model.ChatbotCompletionResponse;
import com.izg.back_end.model.ChatbotMessage;

import jakarta.servlet.http.HttpSession;

@RestController
public class ChatbotController {

	@Autowired
	private RestTemplate restTemplate;

	List<ChatbotMessage> conversationHistory = new ArrayList<>();
  
	// 초기 대화 기록 설정
	public ChatbotController() {
      
	  // 초기 대화 기록 추가
  	  conversationHistory.add(new ChatbotMessage("system", "너의 이름은 'WeFAM 매니저', 직업은 세계 최고의 여행지 추천전문가야"));
      conversationHistory.add(new ChatbotMessage("system", "유저가 여행지 추천에 대해 질문하면 친절하게 알려줘"));
      conversationHistory.add(new ChatbotMessage("system", "대답해줄땐 보기 쉽게 줄바꿈을 잘해줘야돼 특히 세가지 정보를 알려줄 때 보기쉽게 1. 2. 3. 이렇게 줄바꿈해서 보여줘"));
      conversationHistory.add(new ChatbotMessage("system", "어조: 친근하게, 존댓말로 해줘"));
      conversationHistory.add(new ChatbotMessage("system", "유저가 여행테마를 산, 실내여행지, 액티비티, 축제, 상관없음 다섯개중에 고를건데 선택한 테마를 기반으로 작성된 지역, 날짜에 갈만한 정보를 세개정도 알려줘"));
	}

	@PostMapping(value = "/chatbot/hitopenaiapi", produces = "application/text; charset=utf8")
	public String getOpenaiResponse(@RequestBody String prompt, HttpSession session) {

		// 최대로 출력 가능한 AI의 답변
		int max_tokens = 2048;
		
		// 사용자가 보낸 새로운 질문을 conversationHistory에 추가
		conversationHistory.add(new ChatbotMessage("user", prompt));

		// 사용자의 요청에 현재의 메세지가 아닌 conversationHistory를 보내어 사용자와 AI의 대화 기록을 전부 보냄
		ChatbotCompletionRequest chatCompletionRequest = new ChatbotCompletionRequest("gpt-3.5-turbo-0125", conversationHistory, prompt,
				max_tokens);
		
		// AI의 답변을 받음
		ChatbotCompletionResponse response = restTemplate.postForObject("https://api.openai.com/v1/chat/completions",
				chatCompletionRequest, ChatbotCompletionResponse.class);

		// AI의 답변을 변수로 할당
		String responseData = response.getChoices().get(0).getMessage().getContent();
		
		// AI의 답변을 conversationHistory에 추가
		conversationHistory.add(new ChatbotMessage("assistant", responseData));

		return responseData;
	}
}
