package com.izg.back_end.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.dto.FeedCommentDto;
import com.izg.back_end.model.FeedCommentModel;
import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.FeedCommentRepository;
import com.izg.back_end.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class FeedCommentService {

	@Autowired
    private UserRepository userRepository;
	
	@Autowired
    private FeedCommentRepository feedCommentRepository;
	
	@Transactional
	public FeedCommentModel addFeedComment(FeedCommentModel fcm) {
		return feedCommentRepository.save(fcm);
	}
	
	@Transactional
	public List<FeedCommentDto> getCommentsByFeedIdx(int feedIdx) {
        // 데이터베이스에서 댓글 조회
        List<FeedCommentModel> comments = feedCommentRepository.findByFeedIdx(feedIdx);

        // FeedComment를 FeedCommentDto로 변환
        return comments.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    // FeedComment를 FeedCommentDto로 변환
    private FeedCommentDto convertToDto(FeedCommentModel comment) {
    	FeedCommentDto dto = new FeedCommentDto();
    	dto.setCmtIdx(comment.getCmtIdx());
        dto.setUserId(comment.getUserId());
        dto.setCmtContent(comment.getCmtContent());
        dto.setPostedAt(comment.getPostedAt());
    	
    	// userId를 통해 User 정보를 조회하고 프사와 닉네임을 DTO에 추가
        UserModel user = userRepository.findById(comment.getUserId())
        		.orElseThrow(() -> new IllegalArgumentException("댓글 작성자를 찾을 수 없습니다."));
        if (user != null) {
        	dto.setProfileImg(user.getProfileImg());
            dto.setNick(user.getNick());
        }
        
        
        return dto;
    }
}
