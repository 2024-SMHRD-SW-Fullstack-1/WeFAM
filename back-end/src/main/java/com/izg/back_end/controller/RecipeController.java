package com.izg.back_end.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.dto.RecipeDto;
import com.izg.back_end.dto.RecipeListDto;
import com.izg.back_end.dto.RecipeListResponseDto;
import com.izg.back_end.service.RecipeService;

@CrossOrigin
@RestController
public class RecipeController {
	
	@Autowired
	private RecipeService recipeService;
	
	// 레시피 추가
	@PostMapping("/families/{familyIdx}/recipe")
	public ResponseEntity<RecipeDto> addRecipe(
	    @PathVariable("familyIdx") int familyIdx,
	    @RequestBody RecipeDto recipeDto
	) {
	    if (familyIdx <= 0) {
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }

	    RecipeDto addedRecipe = recipeService.addRecipe(familyIdx, recipeDto);

	    if (addedRecipe == null) {
	        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	    }

	    return new ResponseEntity<>(addedRecipe, HttpStatus.CREATED);
	}
	
	
	// 특정 가족(familyIdx)에 속한 모든 레시피 목록을 반환하는 메서드
	@GetMapping("/families/{familyIdx}/recipes")
	public ResponseEntity<RecipeListResponseDto> getAllRecipes(
	        @PathVariable("familyIdx") int familyIdx,
	        @RequestParam(value = "page", defaultValue = "0") int page,
	        @RequestParam(value = "size", defaultValue = "6") int size) {

	    if (familyIdx <= 0) {
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }

	    List<RecipeListDto> recipes = recipeService.getAllRecipes(familyIdx, page, size);
	    int totalCount = recipeService.getTotalCount(familyIdx);

	    RecipeListResponseDto response = new RecipeListResponseDto(recipes, totalCount);

	    if (recipes.isEmpty()) {
	        return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
	    }

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
