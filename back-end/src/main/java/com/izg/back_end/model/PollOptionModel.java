package com.izg.back_end.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Data
@Entity
@Table(name = "poll_option")
public class PollOptionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "poll_option_idx")
    private int pollOptionIdx;

    @ManyToOne
    @JoinColumn(name = "poll_idx", nullable = false)
    @JsonBackReference
    private PollModel poll;

    @Column(name = "poll_option_content", nullable = false)
    private String pollOptionContent;
}
