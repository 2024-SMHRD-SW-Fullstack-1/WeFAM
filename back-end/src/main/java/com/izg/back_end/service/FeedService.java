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

	@Transactional
	public FeedModel addFeed(FeedModel fm) {
		return feedRepository.save(fm);
	}
	
	@Transactional(readOnly = true)
	public FeedModel getFeedDetail(int feedIdx) {
		return feedRepository.findById(feedIdx).orElseThrow();
	}
	
	@Transactional(readOnly = true)
	public List<FeedModel> getAllFeeds() {
		return feedRepository.findAllOrderByPostedAtDesc();
	}
	
	@Transactional
	public void updateFeed(int feedIdx, String feedContent) {
		FeedModel fm = feedRepository.findById(feedIdx).orElseThrow();
		fm.setFeedContent(feedContent);
		// 더티 체킹 : save를 호출하지 않아도 트랜잭션이 끝날 때 자동으로 업데이트.
		// 그러나 명시적으로 save를 호출하는 것을 권장하는 경우도 있음.
		feedRepository.save(fm);
	}
	
	@Transactional
	public void deleteFeed(int feedIdx) {
		feedRepository.deleteById(feedIdx);
	}
}