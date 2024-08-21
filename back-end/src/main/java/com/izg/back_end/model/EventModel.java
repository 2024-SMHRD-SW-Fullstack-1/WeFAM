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

@Entity // JPA 관리
@Table(name="event")
@Data
public class EventModel {
	
	@Id //primary key
	@GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가
	@Column(name="e_idx")
	@JsonProperty("eIdx")
	private int eIdx;
	
	@Column(name="m_idx")
	@JsonProperty("mIdx")
	private int mIdx;
	
	@Column(name="start_date")
	@JsonProperty("startDate")
	private LocalDateTime startDate;
	
	@Column(name="end_date")
	@JsonProperty("endDate")
	private LocalDateTime endDate;
	
	@Column(name="title", length=50)
	@JsonProperty("title")
	private String title;
	
	@Column(name="content")
	@JsonProperty("content")
	private String content;
}