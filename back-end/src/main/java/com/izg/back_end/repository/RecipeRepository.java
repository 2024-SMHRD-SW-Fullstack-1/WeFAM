package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.izg.back_end.model.RecipeModel;

public interface RecipeRepository extends JpaRepository<RecipeModel, Integer> {
	// 가족 ID로 레시피 목록 조회
	List<RecipeModel> findByFamilyIdx(int familyIdx);
}
