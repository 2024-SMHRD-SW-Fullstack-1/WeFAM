package com.izg.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.izg.back_end.model.HouseworkLogModel;

public interface HouseworkLogRepository extends JpaRepository<HouseworkLogModel, Integer> {

}
