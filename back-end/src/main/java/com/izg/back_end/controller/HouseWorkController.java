package com.izg.back_end.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.model.HouseWorkModel;
import com.izg.back_end.repository.HouseWorkRepository;
import com.izg.back_end.service.HouseWorkService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class HouseWorkController {

	private final HouseWorkRepository houseWorkRepository;
	private final HouseWorkService houseWorkService;

	@PostMapping("/add-work")
	public HouseWorkModel addWork(@RequestBody HouseWorkModel houseWorkModel) {
		HouseWorkModel work = houseWorkRepository.save(houseWorkModel);
		return work;
	}
	
	@GetMapping("/get-works")
	public List<HouseWorkModel> getAllWorks() {
		return houseWorkService.getAllWorks();
	}

	@PutMapping("/update-work/{workIdx}")
	public HouseWorkModel updateWork(@PathVariable("workIdx") int workIdx, @RequestBody HouseWorkModel houseWorkModel) {
		Optional<HouseWorkModel> existingWork = houseWorkService.getWorkById(workIdx);
		if (existingWork.isPresent()) {
			houseWorkModel.setWorkIdx(workIdx); // 기존 ID 유지
			return houseWorkService.saveOrUpdateWork(houseWorkModel);
		} else {
			throw new RuntimeException("작업을 찾을 수 없습니다.");
		}
	}

	@DeleteMapping("/delete-work/{workIdx}")
	public String deleteWork(@PathVariable("workIdx") int workIdx) {
		houseWorkService.deleteWorkById(workIdx);
		return "작업이 성공적으로 삭제되었습니다.";
	}
}
