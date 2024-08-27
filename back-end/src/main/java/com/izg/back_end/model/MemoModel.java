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
//@Table(name = "memo")
//@Data
public class MemoModel {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "memo_idx")
//    @JsonProperty("memoIdx")
//    private int memoIdx = 0; // 기본값 0
//
//    @Column(name = "memo_title")
//    @JsonProperty("memoTitle")
//    private String memoTitle = ""; // 기본값 빈 문자열
//
//    @Column(name = "memo_content")
//    @JsonProperty("memoContent")
//    private String memoContent = ""; // 기본값 빈 문자열
//
//    @Column(name = "memo_file")
//    @JsonProperty("memoFile")
//    private String memoFile = ""; // 기본값 빈 문자열
//
//    @Column(name = "created_at")
//    @JsonProperty("createdAt")
//    private LocalDateTime createdAt = LocalDateTime.now(); // 기본값 현재 날짜와 시간
//
//    @Column(name = "user_id")
//    @JsonProperty("userId")
//    private String userId = ""; // 기본값 빈 문자열
//
//    @Column(name = "group_idx")
//    @JsonProperty("groupIdx")
//    private int groupIdx = 0; // 기본값 0
}
