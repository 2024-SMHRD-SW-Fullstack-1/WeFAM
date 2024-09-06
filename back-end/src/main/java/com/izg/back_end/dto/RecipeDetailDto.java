package com.izg.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDetailDto {
    private int recipeIdx;           // 레시피의 고유 ID
    private int familyIdx;           // 가족의 고유 ID
    private String recipeCategory;   // 레시피 카테고리
    private String recipeImage;      // 레시피 이미지 URL 또는 경로
    private String recipeName;       // 레시피 이름
    private String recipeDescription;// 레시피 설명
    private String recipeIngredient; // 레시피 재료
    private String recipeCook;       // 레시피 요리 방법
}
