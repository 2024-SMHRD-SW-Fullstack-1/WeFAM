package com.izg.back_end.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.izg.back_end.dto.HouseworkDTO;
import com.izg.back_end.model.HouseworkModel;
import com.izg.back_end.repository.HouseworkRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HouseworkService {

	private final HouseworkRepository houseworkRepository;
	private final ParticipantService participantService;

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

	// 작업 업데이트
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
	public void deleteWorkById(int workIdx) {
		houseworkRepository.deleteById(workIdx);
		participantService.deleteParticipantsByEntityIdx(workIdx);
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