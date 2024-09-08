package com.izg.back_end.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class FeedDto {
	private int feedIdx;
	private int familyIdx;
	private String userId;
	private LocalDateTime postedAt;
	private String feedLocation;
	private String feedType;
	private String feedContent;
	private int feedLikes;
}
