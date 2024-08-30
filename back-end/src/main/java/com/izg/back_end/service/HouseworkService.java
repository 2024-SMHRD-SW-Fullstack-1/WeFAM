package com.izg.back_end.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.model.HouseworkModel;
import com.izg.back_end.repository.HouseworkRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HouseworkService {

	private final HouseworkRepository houseworkRepository;

	// 집안일 추가 또는 수정
	public HouseworkModel saveOrUpdateWork(HouseworkModel houseWorkModel) {
		return houseworkRepository.save(houseWorkModel);
	}
	
	// 모든 작업 조회
    public List<HouseworkModel> getAllWorks() {
        return houseworkRepository.findAll();
    }

	// 특정 집안일 조회
	public Optional<HouseworkModel> getWorkById(int workIdx) {
		return houseworkRepository.findById(workIdx);
	}

	// 집안일 삭제
	public void deleteWorkById(int workIdx) {
		houseworkRepository.deleteById(workIdx);
	}
}