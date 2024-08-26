package com.izg.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.izg.back_end.model.UserModel;

public interface UserRepository extends JpaRepository<UserModel, String> {
    // 기본적인 CRUD 메소드가 자동으로 제공됩니다.
}
