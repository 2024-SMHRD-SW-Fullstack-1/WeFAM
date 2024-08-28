package com.izg.back_end.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.model.FeedModel;
import com.izg.back_end.service.FeedService;

@RestController
@CrossOrigin
public class FeedController {

	@Autowired
	private FeedService feedService;
	
	@PostMapping("/add-feed")
	public FeedModel addFeed(@RequestBody FeedModel fm) {
		System.out.println("Received Feed : " + fm);
		FeedModel addedFeed = feedService.addFeed(fm);;
		return addedFeed;
	}
	
	@GetMapping("/get-all-feeds")
	public List<FeedModel> getAllFeeds() {
		System.out.println("Gotten All Feeds : " + feedService.getAllFeeds());
		return feedService.getAllFeeds();
	}
	
	@DeleteMapping("/delete-feed/{feedIdx}")
	public String deleteFeed(@PathVariable("feedIdx") Integer feedIdx) {
		System.out.println("Received FeedIdx : " + feedIdx);
		feedService.deleteFeed(feedIdx);
		return "redirect:/";
	}
}
