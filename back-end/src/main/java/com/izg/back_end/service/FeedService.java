package com.izg.back_end.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.izg.back_end.model.FeedModel;
import com.izg.back_end.repository.FeedRepository;

@Service
public class FeedService {
	
	@Autowired
	FeedRepository feedRepository;

	public FeedModel addFeed(FeedModel fm) {
		return feedRepository.save(fm);
	}
	
	@Transactional(readOnly = true)
	public List<FeedModel> getAllFeeds() {
		return feedRepository.findAllOrderByPostedAtDesc();
	}
	
	public void deleteFeed(int feedIdx) {
		feedRepository.deleteById(feedIdx);
	}
}
