package com.izg.back_end.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.izg.back_end.dto.FeedDetailDto;
import com.izg.back_end.dto.FeedDto;
import com.izg.back_end.dto.ImageUploadDto;
import com.izg.back_end.model.FeedModel;
import com.izg.back_end.model.FileModel;
import com.izg.back_end.service.FeedService;

@RestController
@CrossOrigin
public class FeedController {
	
	@Autowired
	private FeedService feedService;
	
	@PostMapping("/add-feed")
	public FeedModel addFeed(@RequestBody FeedModel fm) {
		System.out.println("Received feed : " + fm);
		FeedModel addedFeed = feedService.addFeed(fm);
		return addedFeed;
	}
	
	@PostMapping("/add-feed-img")
    public ResponseEntity<String> addFeedImg(@ModelAttribute ImageUploadDto dto) {
        try {
        	System.out.println("이미지를 포함한 피드 업로드 중, 작성자 아이디 : " + dto.getUserId());
        	System.out.println("이미지를 포함한 피드 업로드 중, 개 종류 : " + dto.getEntityType());
            feedService.addFeedWithImages(
            	dto.getFamilyIdx(),
                dto.getUserId(),
                dto.getEntityType(),
                dto.getEntityIdx(),  
                dto.getFileNames(),
                dto.getFileExtensions(),
                dto.getFileSizes(),
                dto.getImages(),
                dto.getFeedContent(),
                dto.getFeedLocation()
            );
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
