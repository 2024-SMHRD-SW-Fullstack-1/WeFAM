package com.izg.back_end.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "participant")
@Data
public class ParticipantModel {
    @Id
    @Column(name = "participant_idx")
    @JsonProperty("participantIdx")
    private int participantIdx = 0; // 기본값 0

    @Column(name = "entity_type")
    @JsonProperty("entityType")
    private String entityType = ""; // 기본값 빈 문자열

    @Column(name = "entity_idx")
    @JsonProperty("entityIdx")
    private int entityIdx = 0; // 기본값 0

    @Column(name = "user_id")
    @JsonProperty("id")
    private String id = ""; // 기본값 빈 문자열
}
