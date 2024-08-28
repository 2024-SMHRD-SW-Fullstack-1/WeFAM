package com.izg.back_end.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.model.HouseWorkModel;
import com.izg.back_end.repository.HouseWorkRepository;


@RestController
public class HouseWorkController {
	
	@Autowired
	private HouseWorkRepository houseWorkRepository;
	
	@PostMapping("/add-work")
	public HouseWorkModel addWork(@RequestBody HouseWorkModel houseWorkModel) {
		System.out.println(houseWorkModel);
		HouseWorkModel work = houseWorkRepository.save(houseWorkModel);
		System.out.println(work);
		return work;
	}
	
}
