package com.izg.back_end.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.model.FeedModel;
import com.izg.back_end.repository.FeedRepository;

@Service
public class FeedService {
	
	@Autowired
	FeedRepository feedRepository;

	public FeedModel addFeed(FeedModel fm) {
		return feedRepository.save(fm);
	}
	
	public List<FeedModel> getAllFeeds() {
		return feedRepository.findAll();
	}
}
