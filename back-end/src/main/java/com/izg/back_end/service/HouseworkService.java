package com.izg.back_end.service;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.izg.back_end.dto.HouseworkDTO;
import com.izg.back_end.model.FileModel;
import com.izg.back_end.model.HouseworkLogModel;
import com.izg.back_end.model.HouseworkModel;
import com.izg.back_end.model.PointLogModel;
import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.FileRepository;
import com.izg.back_end.repository.HouseworkLogRepository;
import com.izg.back_end.repository.HouseworkRepository;
import com.izg.back_end.repository.PointLogRepository;
import com.izg.back_end.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HouseworkService {

	private final HouseworkRepository houseworkRepository;
	private final HouseworkLogRepository houseworkLogRepository; // 추가된 레포지토리
	private final ParticipantService participantService;
	private final FileRepository fileRepository;
	private final PointLogRepository pointLogRepository;
	private final UserRepository userRepository;

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
				// 참여자를 먼저 삭제
				participantService.deleteParticipantsByEntityIdx(workIdx);

				// 집안일과 연관된 파일 삭제 (entityType은 "work"로 고정)
				fileRepository.deleteByEntityTypeAndEntityIdx("work", workIdx);

				// 그 다음 작업을 삭제
				houseworkRepository.deleteById(workIdx);
			} catch (Exception e) {
				throw new RuntimeException("작업 삭제 중 오류가 발생했습니다.", e);
			}
		} else {
			throw new RuntimeException("삭제할 작업을 찾을 수 없습니다.");
		}
	}

	// 미션 완료 처리 및 파일 업로드, 포인트 저장
	@Transactional
	public void completeHouseworkWithFiles(int workIdx, List<MultipartFile> images, int familyIdx, String userId,
			boolean completed, String entityType) throws IOException {
		// 1. 작업 완료 처리
		HouseworkModel housework = houseworkRepository.findByWorkIdx(workIdx);
		if (housework != null) {
			housework.setCompleted(completed);
			houseworkRepository.save(housework);
		}

		// 2. 완료된 작업을 housework_log 테이블에 저장
		if (completed) {
			// housework_log로 복사, entity_idx 저장
			HouseworkLogModel log = new HouseworkLogModel();
			log.setWorkIdx(housework.getWorkIdx());
			log.setFamilyIdx(housework.getFamilyIdx());
			log.setUserId(housework.getUserId());
			log.setTaskType(housework.getTaskType());
			log.setWorkTitle(housework.getWorkTitle());
			log.setWorkContent(housework.getWorkContent());
			log.setDeadline(housework.getDeadline());
			log.setPoints(housework.getPoints());
			log.setCompleted(true); // 완료 상태로 저장
			log.setPostedAt(housework.getPostedAt());
			log.setCompletedAt(LocalDateTime.now()); // 완료된 시간 기록
			log.setEntityIdx(housework.getWorkIdx()); // entity_idx 추가

			houseworkLogRepository.save(log);
		}

		// 3. 포인트 저장 처리
		if (completed) {
			int points = housework.getPoints(); // 해당 작업의 포인트 가져오기
			PointLogModel pointLog = new PointLogModel();
			pointLog.setUserId(userId);
			pointLog.setEntityType(entityType); // daily 또는 shortTerm을 여기서 저장
			pointLog.setEntityIdx(workIdx);
			pointLog.setPoints(points);
			pointLog.setPointedAt(LocalDateTime.now()); // 포인트 적립 시간 설정

			pointLogRepository.save(pointLog); // 포인트 로그 저장
		}

		// 4. 파일 저장 처리
		for (MultipartFile image : images) {
			String fileName = image.getOriginalFilename();
			String fileExtension = fileName != null ? fileName.substring(fileName.lastIndexOf(".") + 1) : "";
			long fileSize = image.getSize();

			FileModel fileModel = new FileModel();
			fileModel.setFamilyIdx(familyIdx);
			fileModel.setUserId(userId);
			fileModel.setEntityType("work");
			fileModel.setEntityIdx(workIdx); // entity_idx로 workIdx 저장
			fileModel.setFileRname(fileName);
			fileModel.setFileUname(fileName + "_" + Instant.now().toEpochMilli());
			fileModel.setFileSize(fileSize);
			fileModel.setFileExtension(fileExtension);
			fileModel.setFileData(image.getBytes());
			fileModel.setUploadedAt(LocalDateTime.now());

			fileRepository.save(fileModel);
		}
	}

	// 참가자 ID 목록을 받아서 각 참가자의 프로필 이미지를 포함한 데이터를 반환하는 메서드
	public List<Map<String, Object>> getParticipantsWithProfile(List<String> participantIds) {
		List<Map<String, Object>> participantsWithProfile = new ArrayList<>();

		for (String participantId : participantIds) {
			Optional<UserModel> userOptional = userRepository.findById(participantId);
			if (userOptional.isPresent()) {
				UserModel user = userOptional.get();
				Map<String, Object> participantData = new HashMap<>();
				participantData.put("id", user.getId());
				participantData.put("name", user.getName());
				participantData.put("profileImg", user.getProfileImg()); // 프로필 이미지 추가
				participantsWithProfile.add(participantData);
			}
		}

		return participantsWithProfile;
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