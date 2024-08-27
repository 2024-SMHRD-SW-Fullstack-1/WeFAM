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
@Table(name = "tbl_calendar")
@Data
public class CalendarModel {

    // 첨부파일 변수 없음. 추가할 것!
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_idx")
    @JsonProperty("eventIdx")
    private int eventIdx = 0;

    @Column(name = "event_title")
    @JsonProperty("eventTitle")
    private String eventTitle = "";

    @Column(name = "event_content")
    @JsonProperty("eventContent")
    private String eventContent = "";

    @Column(name = "event_st_dt")
    @JsonProperty("eventStDt")
    private LocalDate eventStDt = LocalDate.now(); // Default to today's date
    
    @Column(name = "event_st_tm")
    @JsonProperty("eventStTm")
    private LocalTime eventStTm = LocalTime.now(); // Default to current time
    
    @Column(name = "event_ed_dt")
    @JsonProperty("eventEdDt")
    private LocalDate eventEdDt = LocalDate.now(); // Default to today's date
    
    @Column(name = "event_ed_tm")
    @JsonProperty("eventEdTm")
    private LocalTime eventEdTm = LocalTime.now().plusHours(1); // Default to 1 hour from now
    
    @Column(name = "location")
    @JsonProperty("location")
    private String location = "";

    @Column(name = "event_color")
    @JsonProperty("eventColor")
    private String eventColor = "default"; // Default color
    
    @Column(name = "event_alarm")
    @JsonProperty("eventAlarm")
    private String eventAlarm = "none"; // Default alarm setting
    
    @Column(name = "user_id")
    @JsonProperty("id")
    private String id = "";

    @Column(name = "group_idx")
    @JsonProperty("groupIdx")
    private int groupIdx = 0;

    @Column(name = "event_status")
    @JsonProperty("eventStatus")
    private String eventStatus = "scheduled"; // Default status
}
