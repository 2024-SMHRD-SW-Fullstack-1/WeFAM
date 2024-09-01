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

import com.izg.back_end.model.HouseworkModel;
import com.izg.back_end.repository.HouseworkRepository;
import com.izg.back_end.service.HouseworkService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class HouseworkController {

	private final HouseworkRepository houseworkRepository;
	private final HouseworkService houseworkService;

	@PostMapping("/add-work")
	public HouseworkModel addWork(@RequestBody HouseworkModel houseworkModel) {
		HouseworkModel work = houseworkRepository.save(houseworkModel);
		System.out.println("work : " + work);
		return work;
	}
	
	@GetMapping("/get-works")
	public List<HouseworkModel> getAllWorks() {
		return houseworkService.getAllWorks();
	}

	@PutMapping("/update-work/{workIdx}")
	public HouseworkModel updateWork(@PathVariable("workIdx") int workIdx, @RequestBody HouseworkModel houseworkModel) {
		Optional<HouseworkModel> existingWork = houseworkService.getWorkById(workIdx);
		if (existingWork.isPresent()) {
			houseworkModel.setWorkIdx(workIdx); // 기존 ID 유지
			return houseworkService.saveOrUpdateWork(houseworkModel);
		} else {
			throw new RuntimeException("작업을 찾을 수 없습니다.");
		}
	}

	@DeleteMapping("/delete-work/{workIdx}")
	public String deleteWork(@PathVariable("workIdx") int workIdx) {
		houseworkService.deleteWorkById(workIdx);
		System.out.println("삭제 idx : " + workIdx);
		return "작업이 성공적으로 삭제되었습니다.";
	}
}
