package com.izg.back_end.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.dto.PollDto;
import com.izg.back_end.dto.PollOptionDto;
import com.izg.back_end.dto.VoteStatusDto;
import com.izg.back_end.model.PollModel;
import com.izg.back_end.service.PollService;
import com.izg.back_end.service.PollUserService;

@CrossOrigin
@RestController
public class PollController {

	@Autowired
	private PollUserService pollUserService;
    @Autowired
    private PollService pollService;
    
    // 피드에 있는 투표 가져오기
    @GetMapping("/get-polls/{feedIdx}")
    public ResponseEntity<List<PollDto>> getPolls(@PathVariable("feedIdx") int feedIdx) {
        try {
            List<PollModel> polls = pollService.getPollsByFeedIdx(feedIdx);
            
            List<PollDto> pollDtos = polls.stream().map(poll -> {
                List<PollOptionDto> optionDtos = poll.getOptions().stream().map(option ->
                    new PollOptionDto(option.getPollOptionIdx(), option.getPollOptionContent())
                ).collect(Collectors.toList());
                
                return new PollDto(poll.getPollIdx(), poll.getFeedIdx(), poll.getUserId(),
                        poll.getPollTitle(), poll.getCreatedAt(), optionDtos);
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(pollDtos);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

 	
    @PostMapping("/add-polls")
    public ResponseEntity<PollModel> addPolls(@RequestBody PollDto pollDto) {
    	System.out.println("Received poll dto : " + pollDto);
        PollModel addedPoll = pollService.addPolls(pollDto);
        return ResponseEntity.ok(addedPoll);
    }

//    @PostMapping("/vote")
//    public ResponseEntity<Void> vote(@RequestBody VoteDto voteDto) {
//        pollService.vote(voteDto);
//        return ResponseEntity.ok().build();
//    }
    
    // 투표 제목, 내용 보여주기
//    @GetMapping("/get-polls/{pollIdx}/user-vote/{userId}")
//    public ResponseEntity<VoteDto> getUserVote(@PathVariable("pollIdx") int pollIdx, @PathVariable("userId") String userId) {
//        try {
//            PollUserModel vote = pollUserRepository.findByPollAndUserId(pollIdx, userId);
//            if (vote != null) {
//                VoteDto voteDto = new VoteDto(vote.getPoll().getPollIdx(), vote.getUserId(), vote.getPollOption().getPollOptionIdx());
//                return ResponseEntity.ok(voteDto);
//            } else {
//                return ResponseEntity.noContent().build();
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
    
    @GetMapping("/get-poll/{pollIdx}/user/{userId}/status")
    public ResponseEntity<VoteStatusDto> getVoteStatus(@PathVariable("pollIdx") int pollIdx, @PathVariable("userId") String userId) {
        try {
            boolean hasVoted = pollUserService.hasUserVoted(pollIdx, userId);
            return ResponseEntity.ok(new VoteStatusDto(hasVoted));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
