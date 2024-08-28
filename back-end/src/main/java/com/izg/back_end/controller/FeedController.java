package com.izg.back_end.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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
	
	@GetMapping("/fetch-feeds")
	public List<FeedModel> getFeeds() {
		System.out.println("gotten Feeds : " + feedService.getAllFeeds());
		return feedService.getAllFeeds();
	}
}
