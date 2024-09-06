package com.izg.back_end.model;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.LocalTime;

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
@Table(name = "recipe")
public class RecipeModel {
    
    // 레시피의 고유 ID
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_idx", nullable = false)
    private int recipeIdx;
    
    // 가족의 고유 ID
    @Column(name = "family_idx", nullable = false)
    private int familyIdx;
    
    // 레시피 카테고리
    @Column(name = "recipe_category", nullable = false)
    private String recipeCategory;
    
    // 레시피 이미지 URL 또는 경로
    @Column(name = "recipe_image", nullable = false)
    private String recipeImage;
    
    // 레시피 이름
    @Column(name = "recipe_name", nullable = false)
    private String recipeName;
    
    // 레시피 설명
    @Column(name = "recipe_description", nullable = false)
    private String recipeDescription;
    
    // 조리 시간
    @Column(name = "recipe_time", nullable = false)
    private int recipeTime;
    
    // 인분
    @Column(name = "recipe_portion", nullable = false)
    private int recipePortion;
    
    // 레시피 재료
    @Column(name = "recipe_ingredient", nullable = false)
    private String recipeIngredient;
    
    // 레시피 요리 방법
    @Column(name = "recipe_cook", nullable = false)
    private String recipeCook;
    
    // 레시피 업로드 일자
    @Column(name = "posted_at")
    private LocalDateTime postedAt;
}
