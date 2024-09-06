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

@Data
@Entity
@Table(name = "reward")
public class RewardModel {
	
	@Id
	@Column(name = "reward_idx")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty("rewardIdx")
	private int rewardIdx;
	
	@Column(name = "user_id")
	@JsonProperty("userId")
	private String userId;
	
	private String rewardName;
	
	private int rewardPoint;
	
	private boolean isSold;
	
	private String purchase;
	
	private LocalDateTime soldAt;
		
	
}
