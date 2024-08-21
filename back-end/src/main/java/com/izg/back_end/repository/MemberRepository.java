package com.izg.back_end.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.MemberModel;

@Repository
public interface MemberRepository extends JpaRepository<MemberModel,Integer> {
	
	MemberModel findByIdAndPw(String id, String pw);
	Optional<MemberModel> findById(String id); // 회원정보 조회
	void deleteById(String id); // 회원 삭제
}