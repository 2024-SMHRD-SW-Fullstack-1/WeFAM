package com.izg.back_end.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Data
@Entity
@Table(name = "poll")
public class PollModel {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "poll_idx")
    private int pollIdx;

    @Column(name = "feed_idx", nullable = false)
    private int feedIdx;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "poll_title", nullable = false)
    private String pollTitle;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<PollOptionModel> options; // PollModel과 PollOptionModel의 연관 관계
}
