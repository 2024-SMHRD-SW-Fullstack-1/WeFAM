package com.izg.back_end.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeListResponseDto {
    private List<RecipeListDto> recipes;
    private int totalCount;
}