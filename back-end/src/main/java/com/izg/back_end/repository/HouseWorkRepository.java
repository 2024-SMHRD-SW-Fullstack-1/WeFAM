package com.izg.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.izg.back_end.model.HouseWorkModel;

public interface HouseWorkRepository extends JpaRepository<HouseWorkModel, Integer> {
	
}
