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
@Table(name="tdl_joining")
@Data
public class JoiningModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "join_idx")
    @JsonProperty("joinIdx")
    private int joinIdx;

    @Column(name = "user_id")
    @JsonProperty("id")
    private String id;

    @Column(name = "group_idx")
    @JsonProperty("groupIdx")
    private int groupIdx;
    
    @Column(name = "joinedAt")
    @JsonProperty("joinedAt")
    private LocalDateTime joinedAt;
}
