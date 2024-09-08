package com.izg.back_end.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.dto.FeedDetailDto;
import com.izg.back_end.dto.FeedDto;
import com.izg.back_end.dto.ImageUploadDto;
import com.izg.back_end.dto.PollDto;
import com.izg.back_end.dto.PollOptionDto;
import com.izg.back_end.dto.RouletteDto;
import com.izg.back_end.model.FeedModel;
import com.izg.back_end.model.FileModel;
import com.izg.back_end.repository.FeedRepository;
import com.izg.back_end.service.FeedService;
import com.izg.back_end.service.PollService;
import com.izg.back_end.service.RouletteService;

import jakarta.transaction.Transactional;

@RestController
@CrossOrigin
public class FeedController {

	@Autowired
	private FeedService feedService;

	@Autowired
	private FeedRepository feedRepository;

	@Autowired
	private RouletteService rouletteService;
	
	@Autowired
	private PollService pollService;

	// 기본 피드 추가
//	@PostMapping("/add-feed")
//	public FeedModel addFeed(@RequestBody FeedModel fm) {
//		System.out.println("Received feed : " + fm);
//		FeedModel addedFeed = feedService.addFeed(fm);
//		return addedFeed;
//	}

	// 투표 피드 추가
	@Transactional
	@PostMapping("/add-feed")
	public FeedModel addFeed(@RequestBody FeedModel feed) {
	    System.out.println("요청받은 FeedModel : " + feed);

	    // 피드를 저장합니다.
	    FeedModel savedFeed = feedRepository.save(feed);

	    // 피드에 관련된 룰렛이 있는 경우, 룰렛을 저장합니다.
	    if (feed.getRoulettes() != null && !feed.getRoulettes().isEmpty()) {
	        for (RouletteDto rouletteDto : feed.getRoulettes()) {
	            // 룰렛 DTO의 feedIdx를 설정합니다.
	            rouletteDto.setFeedIdx(savedFeed.getFeedIdx());
	            rouletteDto.setUserId(savedFeed.getUserId());

	            // RouletteOptions를 변환할 필요는 없고
	            // DTO의 rouletteOptions 필드에 이미 배열이 포함되어 있으므로
	            // 그대로 사용하면 됩니다.

	            System.out.println("룰렛 제목 : " + rouletteDto.getRouletteTitle());
	            rouletteService.addRoulettes(rouletteDto);
	        }
	    }
	    
	    // 피드에 관련된 폴이 있는 경우, 폴을 저장합니다.
	    if (feed.getPolls() != null && !feed.getPolls().isEmpty()) {
	        for (PollDto pollDto : feed.getPolls()) {
	            // 폴 DTO의 feedIdx를 설정합니다.
	            pollDto.setFeedIdx(savedFeed.getFeedIdx());
	            pollDto.setUserId(savedFeed.getUserId());

	            // PollOptions를 변환할 필요는 없고, DTO의 pollOptions 필드에 이미 배열이 포함되어 있으므로
	            // 그대로 사용하면 됩니다.

	            System.out.println("투표 제목 : " + pollDto.getPollTitle());
	            pollService.addPolls(pollDto);
	        }
	    }

	    return savedFeed;
	}

	@PostMapping("/add-feed-img")
	public ResponseEntity<String> addFeedImg(@ModelAttribute ImageUploadDto dto) {
		try {
			System.out.println("이미지를 포함한 피드 업로드 중, 작성자 아이디 : " + dto.getUserId());
			System.out.println("이미지를 포함한 피드 업로드 중, 개 종류 : " + dto.getEntityType());
			feedService.addFeedWithImages(dto.getFamilyIdx(), dto.getUserId(), dto.getEntityType(), dto.getEntityIdx(),
					dto.getFileNames(), dto.getFileExtensions(), dto.getFileSizes(), dto.getImages(),
					dto.getFeedContent(), dto.getFeedLocation());
			return ResponseEntity.ok("이미지 저장 완료");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 중 오류 발생");
		}
	}

	@GetMapping("/get-all-feeds/{familyIdx}")
	public List<FeedModel> getAllFeeds(@PathVariable("familyIdx") Integer familyIdx) {
		System.out.println("Gotten my group's feeds : " + feedService.getAllFeeds(familyIdx));
		return feedService.getAllFeeds(familyIdx);
	}

	// 피드에 있는 이미지 가져오기
	@GetMapping("/get-feed-img/{feedIdx}")
	public List<FileModel> getFeedImg(@PathVariable("feedIdx") Integer feedIdx) {
		try {
			return feedService.getFilesByFeedIdx(feedIdx);
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

//	@GetMapping("/get-feed-detail/{feedIdx}")
//	public FeedModel getFeedDetail(@PathVariable("feedIdx") Integer feedIdx) {
//		System.out.println("Gotten feed detail : " + feedService.getFeedDetail(feedIdx));
//		return feedService.getFeedDetail(feedIdx);
//	}

	@GetMapping("/get-feed-detail/{feedIdx}")
	public FeedDetailDto getFeedDetail(@PathVariable("feedIdx") Integer feedIdx) {
		return feedService.getFeedDetail(feedIdx);
	}

	@PatchMapping("/update-feed/{feedIdx}")
	public void updateFeed(@PathVariable("feedIdx") Integer feedIdx, @RequestBody FeedDto fd) {
		System.out.println("To update received FeedIdx : " + feedIdx);
		feedService.updateFeed(feedIdx, fd.getFeedContent());
	}

	@DeleteMapping("/delete-feed/{feedIdx}")
	public void deleteFeed(@PathVariable("feedIdx") Integer feedIdx) {
		System.out.println("To delete received FeedIdx : " + feedIdx);
		feedService.deleteFeed(feedIdx);
		// return "redirect:/";
	}
}