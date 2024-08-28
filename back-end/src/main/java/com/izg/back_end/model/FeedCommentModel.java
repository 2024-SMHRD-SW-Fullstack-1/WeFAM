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
@Table(name = "feed_comment")
@Data
public class FeedCommentModel {

		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "cmt_idx")
	    @JsonProperty("cmtIdx")
	    private int cmtIdx;
		
		@Column(name = "feed_idx")
	    @JsonProperty("feedIdx")
	    private int feedIdx;
	    
	    @Column(name = "cmt_content")
	    @JsonProperty("cmtContent")
	    private String cmtContent;
	      
	    @Column(name = "cmt_likes")
	    @JsonProperty("cmtLikes")
	    private int cmtLikes;
	    
//	    @Column(name = "location")
//	    @JsonProperty("location")
//	    private String location;
	    
//	    @Column(name = "created_at")
//	    @JsonProperty("createdAt")
//	    private LocalDateTime createdAt;
	    
	    @Column(name = "user_id")
	    @JsonProperty("id")
	    private String id;   
	}
