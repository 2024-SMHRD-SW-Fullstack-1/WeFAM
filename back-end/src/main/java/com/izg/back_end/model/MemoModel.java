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
@Table(name="tbl_memo")
@Data
public class MemoModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "memo_idx")
    @JsonProperty("memoIdx")
    private int memoIdx;

    @Column(name = "memo_title")
    @JsonProperty("memoTitle")
    private String memoTitle;

    @Column(name = "memo_content")
    @JsonProperty("memoContent")
    private String memoContent;
    
    @Column(name = "memo_file")
    @JsonProperty("memoFile")
    private String memoFile;
    
    @Column(name = "created_at")
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;

    @Column(name = "user_id")
    @JsonProperty("userId")
    private String userId;

    @Column(name = "group_idx")
    @JsonProperty("groupIdx")
    private int groupIdx;	
}
