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
@Table(name="tbl_feed")
@Data
public class FeedModel {

		// 첨부파일 변수 없음. 추가할 것!
		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "feed_idx")
	    @JsonProperty("feedIdx")
	    private int feedIdx;

	    @Column(name = "feed_type")
	    @JsonProperty("feedType")
	    private String feedType;

	    @Column(name = "feed_title")
	    @JsonProperty("feedTitle")
	    private String feedTitle;
	    
	    @Column(name = "feed_content")
	    @JsonProperty("feedContent")
	    private String feedContent;
	    
	    @Column(name = "created_at")
	    @JsonProperty("createdAt")
	    private LocalDateTime createdAt;
	    
	    @Column(name = "feed_views")
	    @JsonProperty("feedViews")
	    private int feedViews;
	    
	    @Column(name = "feed_likes")
	    @JsonProperty("feedLikes")
	    private int feedLikes;
	    
//	    @Column(name = "location")
//	    @JsonProperty("location")
//	    private String location;
	     
	    @Column(name = "user_id")
	    @JsonProperty("id")
	    private String id;
	    
	    @Column(name = "group_idx")
	    @JsonProperty("groupIdx")
	    private String groupIdx;
	    
	}
