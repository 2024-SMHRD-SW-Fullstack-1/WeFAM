package com.izg.back_end.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="tbl_gallery")
@Data
public class GalleryModel {

		// 첨부파일 변수 없음. 추가할 것!
		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "gallery_idx")
	    @JsonProperty("galleryIdx")
	    private int galleryIdx;
		
	    @Column(name = "group_idx")
	    @JsonProperty("groupIdx")
	    private int groupIdx;
	    
	    @Column(name = "file_rname")
	    @JsonProperty("fileRname")
	    private String fileRname;

	    @Column(name = "file_size")
	    @JsonProperty("fileSize")
	    private int fileSize;
	    
	    @Column(name = "file_ext")
	    @JsonProperty("fileExt")
	    private String fileExt;
	    
	    @Column(name = "user_id")
	    @JsonProperty("id")
	    private String id;
	    
	    @Column(name = "uploaded_at")
	    @JsonProperty("uploadedAt")
	    private LocalDateTime uploadedAt;
	    
	    @Column(name = "filegroup_idx")
	    @JsonProperty("filegroupIdx")
	    private int filegroupIdx;    
	}
