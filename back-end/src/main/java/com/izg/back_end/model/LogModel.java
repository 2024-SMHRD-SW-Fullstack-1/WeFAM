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
@Table(name="tbl_log")
@Data
public class LogModel {

		// 첨부파일 변수 없음. 추가할 것!
		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "log_idx")
	    @JsonProperty("logIdx")
	    private int logIdx;

	    @Column(name = "log_type")
	    @JsonProperty("logType")
	    private String logType;

	    @Column(name = "log_time")
	    @JsonProperty("logTime")
	    private LocalDateTime logTime;
	    
	    @Column(name = "log_status")
	    @JsonProperty("logStatus")
	    private String logStatus;
	    
	    @Column(name = "user_id")
	    @JsonProperty("id")
	    private String id;
	    
	    @Column(name = "user_token")
	    @JsonProperty("userToken")
	    private String userToken;
	    
	    @Column(name = "token_expired_at")
	    @JsonProperty("tokenExpiredAt")
	    private LocalDateTime tokenExpiredAt;    
	}
