package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.PollModel;

@Repository
public interface PollRepository extends JpaRepository<PollModel, Integer> {

	// 피드의 투표들을 찾기 위한 메서드
    // List<PollModel> findPollsByFeedIdx(@Param("feedIdx") Integer feedIdx);
    
	@Query("SELECT p FROM PollModel p WHERE p.feedIdx = :feedIdx")
    List<PollModel> findPollsByFeedIdx(@Param("feedIdx") int feedIdx);
	
	// PollModel findById(int pollIdx);
}