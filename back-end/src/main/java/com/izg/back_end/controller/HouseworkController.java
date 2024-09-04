package com.izg.back_end.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.model.HouseworkModel;
import com.izg.back_end.repository.HouseworkRepository;
import com.izg.back_end.service.HouseworkService;
import com.izg.back_end.service.ParticipantService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class HouseworkController {

	private final HouseworkRepository houseworkRepository;
	private final HouseworkService houseworkService;
	private final ParticipantService participantService;

	@PostMapping("/add-work")
	public HouseworkModel addWork(@RequestBody HouseworkModel houseworkModel) {
		HouseworkModel work = houseworkRepository.save(houseworkModel);

		// 작업 저장 후 참여자 저장
		List<String> userIdsList = Arrays.asList(houseworkModel.getUserId().split(","));
		participantService.saveParticipants(work.getWorkIdx(), userIdsList);
		System.out.println("work : " + work);
		return work;
	}

	@GetMapping("/get-works")
	public List<Map<String, Object>> getAllWorks() {
		List<HouseworkModel> works = houseworkService.getAllWorks();
		List<Map<String, Object>> result = new ArrayList<>();

		for (HouseworkModel work : works) {
			// 작업에 대한 정보를 Map에 담음
			Map<String, Object> workMap = new HashMap<>();
			workMap.put("workIdx", work.getWorkIdx());
			workMap.put("workTitle", work.getWorkTitle());
			workMap.put("workContent", work.getWorkContent());
			workMap.put("taskType", work.getTaskType());
			workMap.put("points", work.getPoints());
			workMap.put("deadline", work.getDeadline());
			workMap.put("completed", work.isCompleted());
			workMap.put("userId", work.getUserId());
			workMap.put("familyIdx", work.getFamilyIdx());

			// 해당 작업에 참여한 유저 ID 리스트를 가져옴
			List<String> participantIds = participantService.findParticipantsByWorkIdx(work.getWorkIdx());
			// 유저 ID 리스트를 통해 유저 이름을 가져옴
			List<String> participantNames = participantService.getUserNamesByUserIds(participantIds);
			workMap.put("participantNames", participantNames);

			result.add(workMap);
		}

		return result;
	}

	@PutMapping("/update-work/{workIdx}")
	public HouseworkModel updateWork(@PathVariable("workIdx") int workIdx, @RequestBody HouseworkModel houseworkModel) {
		Optional<HouseworkModel> existingWork = houseworkService.getWorkById(workIdx);
		if (existingWork.isPresent()) {
			houseworkModel.setWorkIdx(workIdx); // 기존 ID 유지
			HouseworkModel updatedWork = houseworkService.saveOrUpdateWork(houseworkModel);

			// 기존 참여자 삭제 후 다시 저장
			participantService.deleteParticipantsByEntityIdx(workIdx);
			List<String> userIdsList = Arrays.asList(houseworkModel.getUserId().split(","));
			participantService.saveParticipants(updatedWork.getWorkIdx(), userIdsList);

			System.out.println("updatedWork : " + updatedWork);
			return updatedWork;
		} else {
			throw new RuntimeException("작업을 찾을 수 없습니다.");
		}
	}

	@DeleteMapping("/delete-work/{workIdx}")
	public String deleteWork(@PathVariable("workIdx") int workIdx) {
		System.out.println("삭제 idx : " + workIdx);
		houseworkService.deleteWorkById(workIdx);
		return "작업이 성공적으로 삭제되었습니다.";
	}
}