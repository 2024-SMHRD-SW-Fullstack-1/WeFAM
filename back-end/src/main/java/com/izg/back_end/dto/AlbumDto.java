package com.izg.back_end.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AlbumDto {
    private Long albumId;
    private String userId;
    private String imageName;
    private String imageUrl; // 클라이언트에서 이미지를 표시할 URL
    private LocalDateTime uploadedAt;
}
