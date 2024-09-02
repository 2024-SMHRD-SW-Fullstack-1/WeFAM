package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.izg.back_end.model.FileModel;

public interface FileRepository extends JpaRepository<FileModel, Integer> {
	@Modifying
    @Query("DELETE FROM FileModel f WHERE f.entityType = :entityType AND f.entityIdx = :entityIdx")
    void deleteByEntityTypeAndEntityIdx(@Param("entityType") String entityType, @Param("entityIdx") Integer entityIdx);
	List<FileModel> findByEntityTypeAndEntityIdx(String entityType, int entityIdx);
}
