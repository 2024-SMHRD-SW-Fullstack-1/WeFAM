package com.izg.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.izg.back_end.model.FeedModel;

public interface FeedRepository extends JpaRepository<FeedModel, Integer> {
	

}
