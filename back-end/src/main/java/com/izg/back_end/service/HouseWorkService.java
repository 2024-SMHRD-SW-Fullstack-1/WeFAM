package com.izg.back_end.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.model.HouseWorkModel;
import com.izg.back_end.repository.HouseWorkRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HouseWorkService {

	private final HouseWorkRepository houseWorkRepository;

	// 집안일 추가 또는 수정
	public HouseWorkModel saveOrUpdateWork(HouseWorkModel houseWorkModel) {
		return houseWorkRepository.save(houseWorkModel);
	}
	
	// 모든 작업 조회
    public List<HouseWorkModel> getAllWorks() {
        return houseWorkRepository.findAll();
    }

	// 특정 집안일 조회
	public Optional<HouseWorkModel> getWorkById(int workIdx) {
		return houseWorkRepository.findById(workIdx);
	}

	// 집안일 삭제
	public void deleteWorkById(int workIdx) {
		houseWorkRepository.deleteById(workIdx);
	}
}