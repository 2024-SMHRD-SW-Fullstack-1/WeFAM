package com.izg.back_end.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.dto.VoteStatusDto;
import com.izg.back_end.model.PollUserModel;
import com.izg.back_end.repository.PollUserRepository;

import jakarta.transaction.Transactional;

@Service
public class PollUserService {

	@Autowired
	private PollUserRepository pollUserRepository;

	public boolean hasUserVoted(int pollIdx, String userId) {
	    // 투표 여부를 확인하는 로직을 구현
	    return pollUserRepository.existsByPollIdxAndUserId(pollIdx, userId);
	}
}
