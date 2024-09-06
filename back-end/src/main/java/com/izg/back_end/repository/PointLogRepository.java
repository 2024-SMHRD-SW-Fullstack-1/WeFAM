package com.izg.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.izg.back_end.model.PointLogModel;

public interface PointLogRepository extends JpaRepository<PointLogModel, Integer> {

	// 특정 사용자의 총 포인트 합계를 계산하는 쿼리
	@Query("SELECT SUM(p.points) FROM PointLogModel p WHERE p.userId = :userId")
	Integer getTotalPointsByUserId(@Param("userId") String userId);
}
