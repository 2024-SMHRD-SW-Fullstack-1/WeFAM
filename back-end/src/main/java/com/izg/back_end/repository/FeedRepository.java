package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.izg.back_end.model.FeedModel;
import com.izg.back_end.model.FileModel;

public interface FeedRepository extends JpaRepository<FeedModel, Integer> {
	
	// familyIdx를 기준으로 피드를 검색하고 정렬하는 메서드
	// 작성일 기준 역순으로 정렬된 피드를 가져오는 JPQL 쿼리
	// @Query("SELECT f FROM FeedModel f ORDER BY f.postedAt DESC")
    List<FeedModel> findByFamilyIdxOrderByPostedAtDesc(int familyIdx);
    
    // 피드에 관련된 이미지들을 찾기 위한 메서드
    @Query("SELECT f FROM FileModel f WHERE f.entityType = 'feed' AND f.entityIdx = :feedIdx")
    List<FileModel> findFilesByFeedIdx(@Param("feedIdx") Integer feedIdx);
}