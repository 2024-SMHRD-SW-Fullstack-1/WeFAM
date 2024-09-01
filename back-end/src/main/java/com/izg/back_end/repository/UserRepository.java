package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.UserModel;

@Repository
public interface UserRepository extends JpaRepository<UserModel, String> {
	 // 특정 사용자의 가족 구성원을 찾는 메서드 정의
	
}