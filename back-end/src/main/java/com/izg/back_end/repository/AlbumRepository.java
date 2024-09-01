package com.izg.back_end.repository;

import com.izg.back_end.model.AlbumModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlbumRepository extends JpaRepository<AlbumModel, Long> {
    List<AlbumModel> findAllByUploadedAtBetween(LocalDateTime start, LocalDateTime end);
}
