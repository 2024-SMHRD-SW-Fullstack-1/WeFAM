package com.izg.back_end.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
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
import com.izg.back_end.model.FileModel;
import com.izg.back_end.model.HouseworkLogModel;
import com.izg.back_end.model.HouseworkModel;
import com.izg.back_end.repository.FileRepository;
import com.izg.back_end.repository.HouseworkLogRepository;
import com.izg.back_end.service.HouseworkService;
import com.izg.back_end.service.ParticipantService;
import com.izg.back_end.service.PointLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class HouseworkController {

	private final HouseworkService houseworkService;
	private final HouseworkLogRepository houseworkLogRepository;
	private final ParticipantService participantService;
	private final FileRepository fileRepository;
	private final PointLogService pointLogService;

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
	public ResponseEntity<Map<String, Object>> getAllWorks(@RequestParam("userId") String userId) {
		List<HouseworkModel> works = houseworkService.getAllWorks();
		List<HouseworkDTO> result = new ArrayList<>();

		for (HouseworkModel work : works) {
			List<String> participantIds = participantService.findParticipantsByWorkIdx(work.getWorkIdx());
			List<String> participantNames = participantService.findParticipantNamesByWorkIdx(work.getWorkIdx());

			// 작업과 연관된 파일(이미지)을 불러옴
			List<FileModel> files = fileRepository.findByEntityTypeAndEntityIdx("work", work.getWorkIdx());

			// 이미지를 Base64로 변환
			List<String> images = new ArrayList<>();
			for (FileModel file : files) {
				String base64File = Base64.getEncoder().encodeToString(file.getFileData());
				images.add("data:image/" + file.getFileExtension() + ";base64," + base64File);
			}

			// DTO로 변환
			HouseworkDTO dto = houseworkService.convertModelToDto(work, participantIds);
			dto.setParticipantNames(participantNames); // DTO에 이름 목록 추가
			dto.setImages(images); // DTO에 이미지 목록 추가

			result.add(dto);
		}

		// 사용자별 총 포인트 계산 (포인트 로그 서비스 사용)
		Integer totalPoints = pointLogService.getTotalPointsByUserId(userId);

		// 집안일 리스트와 총 포인트를 함께 반환
		Map<String, Object> response = new HashMap<>();
		response.put("works", result);
		response.put("totalPoints", totalPoints); // 총 포인트 추가

		return ResponseEntity.ok(response);
	}

	// 완료된 작업 (housework_log) 목록 가져오기
	@GetMapping("/completed-works")
	public ResponseEntity<List<Map<String, Object>>> getCompletedWorks() {
		List<HouseworkLogModel> completedWorks = houseworkLogRepository.findAll();
		List<Map<String, Object>> result = new ArrayList<>();

		for (HouseworkLogModel log : completedWorks) {
			// 작업과 연관된 파일(이미지)을 entity_idx를 기준으로 불러옴
			List<FileModel> files = fileRepository.findByEntityTypeAndEntityIdx("work", log.getEntityIdx());

			// 이미지를 Base64로 변환
			List<String> images = new ArrayList<>();
			for (FileModel file : files) {
				try {
					String base64File = Base64.getEncoder().encodeToString(file.getFileData());
					images.add("data:image/" + file.getFileExtension() + ";base64," + base64File);
				} catch (Exception e) {
					System.err.println("Error encoding image for workIdx: " + log.getWorkIdx());
					e.printStackTrace();
				}
			}

			// 작업 로그와 이미지를 함께 반환
			Map<String, Object> logWithImages = new HashMap<>();
			logWithImages.put("workLog", log);
			logWithImages.put("images", images); // 이미지 추가

			result.add(logWithImages);
		}

		return ResponseEntity.ok(result);
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
			System.out.println("entityIdx: " + dto.getEntityIdx());
			System.out.println("entityType: " + dto.getEntityType()); // entityType 확인용 출력

			// MultipartFile로 변환된 이미지들만 추출
			List<MultipartFile> images = dto.getImages();

			// Service 호출
			houseworkService.completeHouseworkWithFiles(dto.getEntityIdx(), // 작업 ID
					images, // 이미지 리스트 (List<MultipartFile>)
					dto.getFamilyIdx(), // familyIdx
					dto.getUserId(), // userId
					completed, // 작업 완료 여부
					dto.getEntityType() // entityType 전달
			);

			return ResponseEntity.ok("작업 완료 및 이미지 저장 완료");
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 중 오류 발생");
		}
	}
}