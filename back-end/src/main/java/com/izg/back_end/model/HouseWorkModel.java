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
@Table(name = "housework")
@Data
public class HouseWorkModel {

	@Id
	@Column(name = "work_idx")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty("workIdx")
	private int workIdx = 0; // 기본값 0

	@Column(name = "family_idx")
	@JsonProperty("familyIdx")
	private int familyIdx = 0; // 기본값 0

	@Column(name = "user_id")
	@JsonProperty("userId")
	private String userId = ""; // 기본값 빈 문자열
	
	@Column(name = "work_user")
    @JsonProperty("workUser")
    private String workUser = ""; // 기본값 빈 문자열, 담당자 이름

	@Column(name = "work_title")
	@JsonProperty("workTitle")
	private String workTitle = ""; // 기본값 빈 문자열

	@Column(name = "task_type")
	@JsonProperty("taskType")
	private String taskType = ""; // 기본값 빈 문자열 (예: "daily" 또는 "shortTerm")

	@Column(name = "work_note")
	@JsonProperty("workNote")
	private String workNote = ""; // 기본값 빈 문자열

	@Column(name = "completed")
	@JsonProperty("completed")
	private boolean completed = false; // 기본값 false

	@Column(name = "points")
	@JsonProperty("points")
	private int points = 0; // 기본값 0

	@Column(name = "deadline")
	@JsonProperty("deadline")
	private String deadline; // 단기 작업의 경우 마감일을 저장 (형식은 yyyy-MM-dd)

	@Column(name = "points_date")
	@JsonProperty("pointsDate")
	private LocalDateTime pointsDate = LocalDateTime.now(); // 포인트가 부여된 날짜 및 시간
}