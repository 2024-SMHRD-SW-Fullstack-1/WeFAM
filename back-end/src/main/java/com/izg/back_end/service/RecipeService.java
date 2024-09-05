package com.izg.back_end.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.dto.RecipeDto;
import com.izg.back_end.model.RecipeModel;
import com.izg.back_end.repository.RecipeRepository;

@Service
public class RecipeService {
	@Autowired
	private RecipeRepository recipeRepository;
	
	public List<RecipeDto> getAllRecipes(int familyIdx) {
		// DB -> Model
		List<RecipeModel> recipes = recipeRepository.findByFamilyIdx(familyIdx);
		// Model -> DTO
		List<RecipeDto> recipeDtos = new ArrayList<>();
		for (RecipeModel recipe : recipes) {
			
		}
		return recipeDtos;
	}
}
