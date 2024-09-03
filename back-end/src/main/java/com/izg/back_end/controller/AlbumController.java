package com.izg.back_end.controller;

import com.izg.back_end.dto.ImageUploadDto;
import com.izg.back_end.model.FileModel;
import com.izg.back_end.service.AlbumService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AlbumController {

    @Autowired
    private AlbumService albumService;

    // 이미지 저장
    @PostMapping("/add-album-img")
    public ResponseEntity<String> addAlbumImg(@ModelAttribute ImageUploadDto dto) {
        try {
            System.out.println("앨범 이미지 업로드 중, 작성자 아이디: " + dto.getUserId());
            albumService.addAlbumWithImages(dto.getFamilyIdx(), dto.getUserId(), dto.getEntityType(),
                    dto.getEntityIdx(), dto.getFileNames(), dto.getFileExtensions(),
                    dto.getFileSizes(), dto.getImages());
            return ResponseEntity.ok("앨범 및 이미지 저장 완료");
        } catch (Exception e) {
        	System.out.println("에러에러");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 중 오류 발생");
        }
    }
    
 // 패밀리의 모든 이미지를 불러오는 엔드포인트
    @GetMapping("/get-album-images/{familyIdx}")
    public ResponseEntity<List<FileModel>> getAlbumImages(@PathVariable int familyIdx) {
        List<FileModel> images = albumService.getImagesByFamilyIdx(familyIdx);
        return ResponseEntity.ok(images);
    }
}
