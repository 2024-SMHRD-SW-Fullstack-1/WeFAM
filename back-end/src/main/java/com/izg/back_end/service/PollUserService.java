package com.izg.back_end.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.dto.VoteDto;
import com.izg.back_end.dto.VoteResultDto;
import com.izg.back_end.model.PollUserModel;
import com.izg.back_end.repository.PollOptionRepository;
import com.izg.back_end.repository.PollRepository;
import com.izg.back_end.repository.PollUserRepository;

import jakarta.transaction.Transactional;

@Service
public class PollUserService {

	@Autowired
	private PollRepository pollRepository;

	@Autowired
	private PollOptionRepository pollOptionRepository;

	@Autowired
	private PollUserRepository pollUserRepository;

	// 투표 여부 확인
	public boolean hasUserVoted(int pollIdx, String userId) {
		return pollUserRepository.existsByPollIdxAndUserId(pollIdx, userId);
	}

	// 투표
	@Transactional
	public void vote(VoteDto voteDto) {

		boolean existingVote = pollUserRepository.existsByPollIdxAndUserId(voteDto.getPollIdx(), voteDto.getUserId());

		if (existingVote == true) {
			// 투표 수정 로직
			System.out.println("이미 투표를 하셨는데요?");

		} else if (existingVote == false) {
			// 새 투표 로직
			PollUserModel newVote = new PollUserModel();
			newVote.setPollIdx(voteDto.getPollIdx());
			newVote.setUserId(voteDto.getUserId());
			newVote.setSelectedOptionNum(voteDto.getSelectedOptionNum());
			pollUserRepository.save(newVote);
		}
	}

	// 투표 결과 확인
	@Transactional
	public List<VoteResultDto> getVoteResult(int pollId) {
		List<Object[]> results = pollUserRepository.findVoteResultsByPollIdx(pollId);
		List<VoteResultDto> voteResults = new ArrayList<>();
		for (Object[] result : results) {
			int choiceIndex = (int) result[0];
			// jpql은 count함수를 long으로 반환
			// 수정: Long 타입으로 반환된 값을 int로 변환하여 사용
			long voteCount = (long) result[1];
			voteResults.add(new VoteResultDto(choiceIndex, voteCount));
		}
		System.out.println("투표 결과 : " + voteResults);

		return voteResults;
	}
}
