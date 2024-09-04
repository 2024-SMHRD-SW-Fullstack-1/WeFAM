package com.izg.back_end.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.izg.back_end.dto.PollDto;
import com.izg.back_end.dto.PollOptionDto;
import com.izg.back_end.dto.VoteStatusDto;
import com.izg.back_end.model.PollModel;
import com.izg.back_end.model.PollOptionModel;
import com.izg.back_end.model.PollUserModel;
import com.izg.back_end.repository.PollOptionRepository;
import com.izg.back_end.repository.PollRepository;
import com.izg.back_end.repository.PollUserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PollService {

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private PollOptionRepository pollOptionRepository;

    @Autowired
    private PollUserRepository pollUserRepository;

    @Transactional
    public PollModel addPolls(PollDto pollDto) {
        PollModel poll = new PollModel();
        poll.setFeedIdx(pollDto.getFeedIdx());
        poll.setUserId(pollDto.getUserId());
        poll.setPollTitle(pollDto.getPollTitle());
        poll.setCreatedAt(LocalDateTime.now());

        pollRepository.save(poll);

        for (PollOptionDto optionDto : pollDto.getPollOptions()) {
            PollOptionModel option = new PollOptionModel();
            option.setPoll(poll);
            option.setPollOptionContent(optionDto.getPollOptionContent());
            pollOptionRepository.save(option);
        }

        return poll;
    }

    @Transactional(readOnly = true)
	public List<PollModel> getPollsByFeedIdx(int feedIdx) {
        return pollRepository.findPollsByFeedIdx(feedIdx);
    }
    
//    @Transactional
//    public void vote(VoteDto voteDto) {
//        PollModel poll = pollRepository.findById(voteDto.getPollIdx())
//            .orElseThrow(() -> new IllegalArgumentException("Invalid poll ID"));
//
//        PollOptionModel selectedOption = pollOptionRepository.findById(voteDto.getPollOptionIdx())
//            .orElseThrow(() -> new IllegalArgumentException("Invalid option ID"));
//
//        PollUserModel existingVote = pollUserRepository.findByPollAndUserId(poll, voteDto.getUserId());
//
//        if (existingVote != null) {
//            // 투표 수정 로직
//            existingVote.setPollOption(selectedOption);
//            existingVote.setVotedAt(LocalDateTime.now());
//            pollUserRepository.save(existingVote);
//        } else {
//            // 새 투표 로직
//            PollUserModel newVote = new PollUserModel();
//            newVote.setPoll(poll);
//            newVote.setPollOption(selectedOption);
//            newVote.setUserId(voteDto.getUserId());
//            newVote.setVotedAt(LocalDateTime.now());
//            pollUserRepository.save(newVote);
//        }
//    }
}
