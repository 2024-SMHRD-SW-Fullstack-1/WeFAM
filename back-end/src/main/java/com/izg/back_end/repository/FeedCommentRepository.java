package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.izg.back_end.model.FeedCommentModel;

public interface FeedCommentRepository extends JpaRepository<FeedCommentModel, Integer> {
	// feed ID로 댓글 조회
    List<FeedCommentModel> findByFeedIdx(int feedIdx);
    
    // 댓글 ID로 댓글 조회
    FeedCommentModel findByCmtIdx(int cmtIdx);
}