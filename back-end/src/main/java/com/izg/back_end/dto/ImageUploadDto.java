package com.izg.back_end.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ImageUploadDto {
    private int familyIdx;
    private String userId;
    private String entityType;
    private int entityIdx;
    private String feedContent;
    private String feedLocation;
    private List<MultipartFile> images;
    private List<String> fileNames;
    private List<String> fileExtensions;
    private List<Long> fileSizes;
    private String fileData;
}