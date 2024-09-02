package com.izg.back_end.service;

import com.izg.back_end.model.AlbumModel;
import com.izg.back_end.repository.AlbumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlbumService {

    @Autowired
    private AlbumRepository albumRepository;

    public AlbumModel saveImage(AlbumModel album) {
        return albumRepository.save(album);
    }

    public List<AlbumModel> getImagesByDateRange(LocalDateTime startOfDay, LocalDateTime endOfDay) {
        return albumRepository.findAllByUploadedAtBetween(startOfDay, endOfDay);
    }
}
