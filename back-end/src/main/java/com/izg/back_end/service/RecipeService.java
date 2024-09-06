package com.izg.back_end.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.izg.back_end.dto.RecipeDto;
import com.izg.back_end.dto.RecipeListDto;
import com.izg.back_end.model.RecipeModel;
import com.izg.back_end.repository.RecipeRepository;

@Service
public class RecipeService {
	
	@Autowired
	public RecipeRepository recipeRepository;
	
	// 레시피 추가
	public RecipeDto addRecipe(int familyIdx, RecipeDto recipeDto) {
	    // RecipeDto -> RecipeModel 변환
	    RecipeModel recipe = new RecipeModel();
	    recipe.setFamilyIdx(familyIdx);  // 가족 ID 설정
	    recipe.setRecipeCategory(recipeDto.getRecipeCategory());
	    recipe.setRecipeImage(recipeDto.getRecipeImage());
	    recipe.setRecipeName(recipeDto.getRecipeName());
	    recipe.setRecipeDescription(recipeDto.getRecipeDescription());
	    recipe.setRecipeTime(recipeDto.getRecipeTime());
	    recipe.setRecipePortion(recipeDto.getRecipePortion());
	    recipe.setRecipeIngredient(recipeDto.getRecipeIngredient());
	    recipe.setRecipeCook(recipeDto.getRecipeCook());
	    recipe.setPostedAt(LocalDateTime.now());

	    // JPA save 메서드로 저장
	    RecipeModel savedRecipe = recipeRepository.save(recipe);

	    // 저장된 RecipeModel -> RecipeDto로 변환하여 반환
	    RecipeDto savedRecipeDto = new RecipeDto();
	    savedRecipeDto.setRecipeIdx(savedRecipe.getRecipeIdx());
	    savedRecipeDto.setRecipeCategory(savedRecipe.getRecipeCategory());
	    savedRecipeDto.setRecipeImage(savedRecipe.getRecipeImage());
	    savedRecipeDto.setRecipeName(savedRecipe.getRecipeName());
	    savedRecipeDto.setRecipeDescription(savedRecipe.getRecipeDescription());
	    savedRecipeDto.setRecipeTime(savedRecipe.getRecipeTime());
	    savedRecipeDto.setRecipePortion(savedRecipe.getRecipePortion());
	    savedRecipeDto.setRecipeIngredient(savedRecipe.getRecipeIngredient());
	    savedRecipeDto.setRecipeCook(savedRecipe.getRecipeCook());
	    
	    return savedRecipeDto;
	}

	
	// 가족 ID에 해당하는 모든 레시피 목록을 반환
    public List<RecipeListDto> getAllRecipes(int familyIdx, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RecipeModel> recipePage = recipeRepository.findByFamilyIdx(familyIdx, pageable);

        // RecipeModel -> RecipeListDto 변환
        List<RecipeListDto> recipeDtos = recipePage.getContent().stream()
                .map(recipe -> new RecipeListDto(
                        recipe.getRecipeIdx(),
                        recipe.getRecipeCategory(),
                        recipe.getRecipeImage(),
                        recipe.getRecipeName()
                ))
                .collect(Collectors.toList());

        return recipeDtos;
    }

    // 가족 ID에 해당하는 총 레시피 개수를 반환
    public int getTotalCount(int familyIdx) {
        return recipeRepository.countByFamilyIdx(familyIdx); // 총 개수를 반환
    }
}
