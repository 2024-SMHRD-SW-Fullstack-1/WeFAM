package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.izg.back_end.model.RecipeModel;

public interface RecipeRepository extends JpaRepository<RecipeModel, Integer>{
	
	// 가족 ID에 해당하는 모든 레시피 목록을 반환
	// List<RecipeModel> findByFamilyIdx(int familyIdx);
	
	// 가족 ID에 해당하는 모든 레시피 목록을 반환 (페이징 적용)
	Page<RecipeModel> findByFamilyIdx(int familyIdx, Pageable pageable);
	
	// 가족 ID에 해당하는 총 레시피 개수를 반환하는 쿼리 메서드 (총 페이지 계산을 위해 필요)
	int countByFamilyIdx(int familyIdx);
}
