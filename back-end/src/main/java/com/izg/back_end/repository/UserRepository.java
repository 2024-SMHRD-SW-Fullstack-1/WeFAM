package com.izg.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.UserModel;

@Repository
public interface UserRepository extends JpaRepository<UserModel, String> {
    // 추가적인 쿼리 메소드가 필요하면 여기서 정의
}
