package com.izg.back_end.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "feed")
@Data
public class FeedModel {

    // 첨부파일 변수 없음. 추가할 것!
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feed_idx")
    @JsonProperty("feedIdx")
    private int feedIdx = 0; // 기본값 0
    
    @Column(name = "family_idx")
    @JsonProperty("familyIdx")
    private int familyIdx = 0; // 기본값 0
    
    @Column(name = "user_id")
    @JsonProperty("id")
    private String id = ""; // 기본값 빈 문자열
  
    @Column(name = "posted_at")
    @JsonProperty("postedAt")
    private LocalDateTime postedAt = LocalDateTime.now(); // 기본값 현재 날짜와 시간
    
    @Column(name = "feed_location")
    @JsonProperty("feedLocation")
    private String feedLocation = ""; // 기본값 빈 문자열, 필요시 주석 해제
    
    @Column(name = "feed_type")
    @JsonProperty("feedType")
    private String feedType = ""; // 기본값 빈 문자열
    
    @Column(name = "feed_content")
    @JsonProperty("feedContent")
    private String feedContent = ""; // 기본값 빈 문자열
    
    @Column(name = "feed_likes")
    @JsonProperty("feedLikes")
    private int feedLikes = 0; // 기본값 0
}