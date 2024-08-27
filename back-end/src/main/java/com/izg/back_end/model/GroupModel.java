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
@Table(name = "tbl_group")
@Data
public class GroupModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_idx")
    @JsonProperty("groupIdx")
    private int groupIdx = 0; // 기본값 0

    @Column(name = "group_name")
    @JsonProperty("groupName")
    private String groupName = ""; // 기본값 빈 문자열

    @Column(name = "created_at")
    @JsonProperty("createdAt")
    private LocalDateTime createdAt = LocalDateTime.now(); // 기본값 현재 날짜와 시간

    @Column(name = "user_id")
    @JsonProperty("id")
    private String id = ""; // 기본값 빈 문자열
}
