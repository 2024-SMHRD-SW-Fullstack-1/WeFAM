package com.izg.back_end.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class HouseworkDTO {
	private int workIdx;
	private int familyIdx;
	private String userId;
	private String taskType;
	private String workTitle;
	private String workContent;
	private LocalDateTime deadline;
	private int points;
	private boolean completed;
	private LocalDateTime postedAt;
	private List<String> workUserIds; // 참여자 목록
    private List<String> participantNames; // 추가된 필드

}
