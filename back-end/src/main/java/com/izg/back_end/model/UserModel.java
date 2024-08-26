package com.izg.back_end.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="tbl_user")
@Data
public class UserModel {
	@Id
    @Column(name = "user_id")
    @JsonProperty("id")
    private String id;

    @Column(name = "user_name")
    @JsonProperty("name")
    private String name;

    @Column(name = "user_nick")
    @JsonProperty("nick")
    private String nick;

    @Column(name = "user_birthdate")
    @JsonProperty("birth")
    private LocalDate birth;

    @Column(name = "user_profile_img")
    @JsonProperty("profileImg")
    private String profileImg;	
    
    @Column(name = "joined_at")
    @JsonProperty("joinedAt")
    private LocalDateTime joinedAt;
    
    @Column(name = "login_source")
    @JsonProperty("loginSource")
    private String loginSource;
}
