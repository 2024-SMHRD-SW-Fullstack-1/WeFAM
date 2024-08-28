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

//@Entity
//@Table(name = "memo_comment")
//@Data
public class MemoCommentModel {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "cmt_idx")
//    @JsonProperty("cmtIdx")
//    private int cmtIdx = 0; // 기본값 0
//
//    @Column(name = "memo_idx")
//    @JsonProperty("memoIdx")
//    private int memoIdx = 0; // 기본값 0
//
//    @Column(name = "cmt_content")
//    @JsonProperty("cmtContent")
//    private String cmtContent = ""; // 기본값 빈 문자열
//
//    @Column(name = "cmt_likes")
//    @JsonProperty("cmtLikes")
//    private String cmtLikes = "0"; // 기본값 "0" (문자열로 저장)
//
//    @Column(name = "created_at")
//    @JsonProperty("createdAt")
//    private LocalDateTime createdAt = LocalDateTime.now(); // 기본값 현재 날짜와 시간
//
//    @Column(name = "user_id")
//    @JsonProperty("userId")
//    private String userId = ""; // 기본값 빈 문자열
}
