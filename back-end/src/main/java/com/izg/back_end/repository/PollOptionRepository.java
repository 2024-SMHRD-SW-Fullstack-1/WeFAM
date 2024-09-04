package com.izg.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.PollOptionModel;

@Repository
public interface PollOptionRepository extends JpaRepository<PollOptionModel, Integer> {

}