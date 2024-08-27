package com.izg.back_end.model;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="calendar")
@Data
public class CalendarModel {

		// 첨부파일 변수 없음. 추가할 것!
		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "event_idx")
	    @JsonProperty("eventIdx")
	    private int eventIdx;

	    @Column(name = "event_title")
	    @JsonProperty("eventTitle")
	    private String eventTitle;

	    @Column(name = "event_content")
	    @JsonProperty("eventContent")
	    private String eventContent;
	    
	    @Column(name = "event_st_dt")
	    @JsonProperty("eventStDt")
	    private LocalDate eventStDt;
	    
	    @Column(name = "event_st_tm")
	    @JsonProperty("eventStTm")
	    private LocalTime eventStTm;
	    
	    @Column(name = "event_ed_dt")
	    @JsonProperty("eventEdDt")
	    private LocalDate eventEdDt;
	    
	    @Column(name = "event_ed_tm")
	    @JsonProperty("eventEdTm")
	    private LocalTime eventEdTm;
	    
	    @Column(name = "location")
	    @JsonProperty("location")
	    private String location;
	    
	    @Column(name = "event_color")
	    @JsonProperty("eventColor")
	    private String eventColor;
	    
	    @Column(name = "event_alarm")
	    @JsonProperty("eventAlarm")
	    private String eventAlarm;
	    
	    @Column(name = "user_id")
	    @JsonProperty("id")
	    private String id;
	    
	    @Column(name = "group_idx")
	    @JsonProperty("groupIdx")
	    private int groupIdx;
	    
	    @Column(name = "event_status")
	    @JsonProperty("eventStatus")
	    private String eventStatus;
	}
