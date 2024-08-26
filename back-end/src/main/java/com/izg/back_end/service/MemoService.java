package com.izg.back_end.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.model.MemoModel;
import com.izg.back_end.repository.MemoRepository;

@Service
public class MemoService {
	
	@Autowired
	MemoRepository memoRepository;

	public MemoModel addMemo(MemoModel mm) {
		return memoRepository.save(mm);
	}
}
