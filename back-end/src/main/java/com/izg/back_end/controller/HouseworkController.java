package com.izg.back_end.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.dto.HouseworkDTO;
import com.izg.back_end.model.HouseworkModel;
import com.izg.back_end.service.HouseworkService;
import com.izg.back_end.service.ParticipantService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class HouseworkController {

	private final HouseworkService houseworkService;
	private final ParticipantService participantService;

	@PostMapping("/add-work")
	public HouseworkDTO addWork(@RequestBody HouseworkDTO houseworkDTO) {
		return houseworkService.createHousework(houseworkDTO);
	}

	@PutMapping("/update-work/{workIdx}")
	public HouseworkDTO updateWork(@PathVariable("workIdx") int workIdx, @RequestBody HouseworkDTO houseworkDTO) {
		return houseworkService.updateHousework(workIdx, houseworkDTO);
	}

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

	@DeleteMapping("/delete-work/{workIdx}")
	public ResponseEntity<String> deleteWork(@PathVariable("workIdx") int workIdx) {
		try {
			houseworkService.deleteWorkById(workIdx);
			return ResponseEntity.ok("작업이 성공적으로 삭제되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("작업 삭제 중 오류가 발생했습니다.");
		}
	}
}
