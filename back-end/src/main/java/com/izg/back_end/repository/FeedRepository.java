package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.izg.back_end.model.FeedModel;

public interface FeedRepository extends JpaRepository<FeedModel, Integer> {
	
	// 작성일 기준 역순으로 정렬된 피드를 가져오는 JPQL 쿼리
	@Query("SELECT f FROM FeedModel f ORDER BY f.postedAt DESC")
	List<FeedModel> findAllOrderByPostedAtDesc();
}
