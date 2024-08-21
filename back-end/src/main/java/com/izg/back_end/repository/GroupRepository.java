package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.GroupModel;

@Repository
public interface GroupRepository extends JpaRepository<GroupModel, Integer> {
	List<GroupModel> findBymId(String mId);
}
