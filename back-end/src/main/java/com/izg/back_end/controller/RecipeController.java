package com.izg.back_end.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.dto.RecipeDto;

@CrossOrigin
@RestController
public class RecipeController {
	
	// 특정 가족(familyIdx)에 속한 모든 레시피 목록을 반환하는 메서드
	@GetMapping("/families/{familyIdx}/recipes")
	public List<RecipeDto> getAllRecipes(@PathVariable("familyIdx") int familyIdx) {
		List<RecipeDto> recipes = new ArrayList<>();
//		recipes.add(new RecipeDto(1, "스파게티", "이미지경로1"));
//		recipes.add(new RecipeDto(2, "삼겹살", "이미지경로2"));
		return recipes;
	}
	
}
