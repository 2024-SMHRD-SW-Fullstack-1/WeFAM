package com.izg.back_end.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.izg.back_end.model.ParticipantModel;
import com.izg.back_end.repository.ParticipantRepository;
import com.izg.back_end.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParticipantService {

	private final ParticipantRepository participantRepository;
	private final UserRepository userRepository; // UserRepository를 이용해 유저 정보 조회

	// 특정 작업에 참여자들 저장
	public void saveParticipants(int workIdx, List<String> userIds) {
		for (String userId : userIds) {
			ParticipantModel participant = new ParticipantModel();
			participant.setEntityType("housework");
			participant.setEntityIdx(workIdx);
			participant.setUserId(userId);

			participantRepository.save(participant);
		}
	}

	// 특정 작업의 모든 참여자 삭제
	public void deleteParticipantsByEntityIdx(int workIdx) {
		participantRepository.deleteByEntityIdxAndEntityType(workIdx, "housework");
	}

	// 특정 작업에 대한 참여자 ID 리스트를 조회
	public List<String> findParticipantsByWorkIdx(int workIdx) {
		return participantRepository.findAllByEntityIdxAndEntityType(workIdx, "housework").stream()
				.map(ParticipantModel::getUserId).collect(Collectors.toList());
	}

	// 유저 ID 리스트를 기반으로 유저 이름 리스트를 조회하는 메서드
	public List<String> getUserNamesByUserIds(List<String> userIds) {
		return userIds.stream()
				.map(userId -> userRepository.findById(userId).map(user -> user.getName()).orElse("Unknown"))
				// 사용자 ID에해당하는이름이없을 경우"Unknown"으로표시
				.collect(Collectors.toList());
	}
}
