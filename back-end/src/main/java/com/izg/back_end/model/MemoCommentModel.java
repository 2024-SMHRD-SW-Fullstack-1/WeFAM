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
@Table(name="tbl_memo_comment")
@Data
public class MemoCommentModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cmt_idx")
    @JsonProperty("cmtIdx")
    private int cmtIdx;

    @Column(name = "memo_idx")
    @JsonProperty("memoIdx")
    private int memoIdx;

    @Column(name = "cmt_content")
    @JsonProperty("cmtContent")
    private String cmtContent;
    
    @Column(name = "cmt_likes")
    @JsonProperty("cmtLikes")
    private String cmtLikes;
    
    @Column(name = "created_at")
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;

    @Column(name = "user_id")
    @JsonProperty("userId")
    private String userId;
}
