package com.izg.back_end.service;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.izg.back_end.dto.HouseworkDTO;
import com.izg.back_end.model.FileModel;
import com.izg.back_end.model.HouseworkModel;
import com.izg.back_end.repository.FileRepository;
import com.izg.back_end.repository.HouseworkRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HouseworkService {

	private final HouseworkRepository houseworkRepository;
	private final ParticipantService participantService;
	private final FileRepository fileRepository;

	// 집안일 추가
	public HouseworkDTO createHousework(HouseworkDTO houseworkDTO) {
		try {
			HouseworkModel houseworkModel = convertDtoToModel(houseworkDTO);
			HouseworkModel savedWork = houseworkRepository.save(houseworkModel);
			participantService.saveParticipants(savedWork.getWorkIdx(), houseworkDTO.getWorkUserIds(),
					houseworkDTO.getUserId()); // 수정된 부분
			return convertModelToDto(savedWork, houseworkDTO.getWorkUserIds());
		} catch (Exception e) {
			throw new RuntimeException("집안일 추가 중 오류가 발생했습니다.", e);
		}
	}

	// 집안일 수정
	public HouseworkDTO updateHousework(int workIdx, HouseworkDTO houseworkDTO) {
		HouseworkModel existingWork = houseworkRepository.findById(workIdx)
				.orElseThrow(() -> new RuntimeException("작업을 찾을 수 없습니다."));

		try {
			HouseworkModel houseworkModel = convertDtoToModel(houseworkDTO);
			houseworkModel.setWorkIdx(workIdx); // 기존 ID 유지

			HouseworkModel updatedWork = houseworkRepository.save(houseworkModel);
			participantService.deleteParticipantsByEntityIdx(workIdx);
			participantService.saveParticipants(updatedWork.getWorkIdx(), houseworkDTO.getWorkUserIds(),
					houseworkDTO.getUserId()); // 수정된 부분

			return convertModelToDto(updatedWork, houseworkDTO.getWorkUserIds());
		} catch (Exception e) {
			throw new RuntimeException("작업 업데이트 중 오류가 발생했습니다.", e);
		}
	}

	// 모든 집안일 조회
	public List<HouseworkModel> getAllWorks() {
		return houseworkRepository.findAll();
	}

	// 집안일 삭제
	@Transactional
	public void deleteWorkById(int workIdx) {
		Optional<HouseworkModel> workOptional = houseworkRepository.findById(workIdx);

		if (workOptional.isPresent()) {
			try {
				// 먼저 참여자를 삭제
				participantService.deleteParticipantsByEntityIdx(workIdx);
				// 그 다음 작업을 삭제
				houseworkRepository.deleteById(workIdx);
			} catch (Exception e) {
				throw new RuntimeException("작업 삭제 중 오류가 발생했습니다.", e);
			}
		} else {
			throw new RuntimeException("삭제할 작업을 찾을 수 없습니다.");
		}
	}

	// 미션 완료 처리 및 파일 업로드
	@Transactional
	public void completeHouseworkWithFiles(int workIdx, List<MultipartFile> images, int familyIdx, String userId,
			boolean completed) throws IOException {
		// 1. 작업 완료 처리
		HouseworkModel housework = houseworkRepository.findByWorkIdx(workIdx);
		if (housework != null) {
			housework.setCompleted(completed);
			houseworkRepository.save(housework);
		}

		// 2. 파일 저장 처리
		for (MultipartFile image : images) {
			String fileName = image.getOriginalFilename();
			String fileExtension = fileName != null ? fileName.substring(fileName.lastIndexOf(".") + 1) : "";
			long fileSize = image.getSize();

			FileModel fileModel = new FileModel();
			fileModel.setFamilyIdx(familyIdx);
			fileModel.setUserId(userId);
			fileModel.setEntityType("work");
			fileModel.setEntityIdx(workIdx);
			fileModel.setFileRname(fileName);
			fileModel.setFileUname(fileName + "_" + Instant.now().toEpochMilli());
			fileModel.setFileSize(fileSize);
			fileModel.setFileExtension(fileExtension);
			fileModel.setFileData(image.getBytes());
			fileModel.setUploadedAt(LocalDateTime.now());

			fileRepository.save(fileModel);
		}
	}

	// DTO를 모델로 변환하는 메서드
	private HouseworkModel convertDtoToModel(HouseworkDTO dto) {
		HouseworkModel model = new HouseworkModel();
		model.setFamilyIdx(dto.getFamilyIdx());
		model.setUserId(dto.getUserId()); // 작업을 추가한 사용자의 아이디를 설정
		model.setTaskType(dto.getTaskType());
		model.setWorkTitle(dto.getWorkTitle());
		model.setWorkContent(dto.getWorkContent());
		model.setDeadline(dto.getDeadline());
		model.setPoints(dto.getPoints());
		model.setCompleted(dto.isCompleted());
		return model;
	}

	// 모델을 DTO로 변환하는 메서드
	public HouseworkDTO convertModelToDto(HouseworkModel model, List<String> workUserIds) {
		HouseworkDTO dto = new HouseworkDTO();
		dto.setWorkIdx(model.getWorkIdx());
		dto.setFamilyIdx(model.getFamilyIdx());
		dto.setUserId(model.getUserId());
		dto.setTaskType(model.getTaskType());
		dto.setWorkTitle(model.getWorkTitle());
		dto.setWorkContent(model.getWorkContent());
		dto.setDeadline(model.getDeadline());
		dto.setPoints(model.getPoints());
		dto.setCompleted(model.isCompleted());
		dto.setPostedAt(model.getPostedAt());
		dto.setWorkUserIds(workUserIds);
		return dto;
	}
}