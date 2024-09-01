package com.izg.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.JoiningModel;

@Repository
public interface JoiningRepository extends JpaRepository<JoiningModel, Integer> {
	JoiningModel findByUserId(String userId);
}
