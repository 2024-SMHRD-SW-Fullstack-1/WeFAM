package com.izg.back_end.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.dto.FeedDto;
import com.izg.back_end.model.FeedModel;
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
	
	@GetMapping("/get-feed-detail/{feedIdx}")
	public FeedModel getFeedDetail(@PathVariable("feedIdx") Integer feedIdx) {
		System.out.println("Gotten feed detail : " + feedService.getFeedDetail(feedIdx));
		return feedService.getFeedDetail(feedIdx);
	}
	
	@GetMapping("/get-all-feeds")
	public List<FeedModel> getAllFeeds() {
		System.out.println("Gotten all feeds : " + feedService.getAllFeeds());
		return feedService.getAllFeeds();
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