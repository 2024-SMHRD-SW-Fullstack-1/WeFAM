package com.izg.back_end.controller;

import com.izg.back_end.model.AlbumModel;
import com.izg.back_end.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AlbumController {

    @Autowired
    private AlbumService albumService;

    @PostMapping("/album/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile image,
                                              @RequestParam("userId") String userId) {
        // 파일 저장 로직 추가
        return ResponseEntity.ok("이미지 업로드 성공");
    }

    @GetMapping("/images-by-date")
    public ResponseEntity<List<AlbumModel>> getImagesByDate(@RequestParam("date") String date) {
        try {
            LocalDate queryDate = LocalDate.parse(date);  // "yyyy-MM-dd" 형식의 날짜를 받음
            LocalDateTime startOfDay = queryDate.atStartOfDay();
            LocalDateTime endOfDay = queryDate.atTime(23, 59, 59);

            List<AlbumModel> images = albumService.getImagesByDateRange(startOfDay, endOfDay);

            return ResponseEntity.ok(images);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}
