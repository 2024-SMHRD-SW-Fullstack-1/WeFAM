package com.izg.back_end.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.izg.back_end.dto.HouseworkDTO;
import com.izg.back_end.dto.ImageUploadDto;
import com.izg.back_end.model.HouseworkModel;
import com.izg.back_end.service.HouseworkService;
import com.izg.back_end.service.ParticipantService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class HouseworkController {

	private final HouseworkService houseworkService;
	private final ParticipantService participantService;

	// 집안일 추가
	@PostMapping("/add-work")
	public HouseworkDTO addWork(@RequestBody HouseworkDTO houseworkDTO) {
		return houseworkService.createHousework(houseworkDTO);
	}

	// 집안일 수정
	@PutMapping("/update-work/{workIdx}")
	public HouseworkDTO updateWork(@PathVariable("workIdx") int workIdx, @RequestBody HouseworkDTO houseworkDTO) {
		return houseworkService.updateHousework(workIdx, houseworkDTO);
	}

	// 집안일 불러오기
	@GetMapping("/get-works")
	public List<HouseworkDTO> getAllWorks() {
		List<HouseworkModel> works = houseworkService.getAllWorks();
		List<HouseworkDTO> result = new ArrayList<>();

		for (HouseworkModel work : works) {
			List<String> participantIds = participantService.findParticipantsByWorkIdx(work.getWorkIdx());
			List<String> participantNames = participantService.findParticipantNamesByWorkIdx(work.getWorkIdx());
			HouseworkDTO dto = houseworkService.convertModelToDto(work, participantIds);
			dto.setParticipantNames(participantNames); // DTO에 이름 목록 추가
			result.add(dto);
		}

		return result;
	}

	// 집안일 삭제
	@DeleteMapping("/delete-work/{workIdx}")
	public ResponseEntity<String> deleteWork(@PathVariable("workIdx") int workIdx) {
		try {
			System.out.println("Received workIdx: " + workIdx);
			houseworkService.deleteWorkById(workIdx);
			return ResponseEntity.ok("작업이 성공적으로 삭제되었습니다.");
		} catch (Exception e) {
			e.printStackTrace(); // 오류 메시지를 콘솔에 출력
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("작업 삭제 중 오류가 발생했습니다.");
		}
	}

	// 작업 완료 및 파일 업로드 엔드포인트
	@PostMapping("/complete-with-files")
	public ResponseEntity<String> completeHouseworkWithFiles(@ModelAttribute ImageUploadDto dto,
			@RequestParam("completed") boolean completed) {
		try {
			System.out.println("작업 완료 및 파일 업로드 중, 작성자 아이디: " + dto.getUserId());

			// 파일 업로드 및 작업 완료 처리 메서드 호출
			houseworkService.completeHouseworkWithFiles(dto.getFamilyIdx(), // familyIdx
					dto.getUserId(), // userId
					dto.getEntityType(), // entityType
					dto.getEntityIdx(), // entityIdx (workIdx로 사용)
					dto.getFileNames(), // 파일 이름 리스트
					dto.getFileExtensions(), // 파일 확장자 리스트
					dto.getFileSizes(), // 파일 크기 리스트
					dto.getImages(), // 파일 이미지 리스트
					completed // 작업 완료 여부
			);

			return ResponseEntity.ok("작업 완료 및 이미지 저장 완료");
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 중 오류 발생");
		}
	}
}