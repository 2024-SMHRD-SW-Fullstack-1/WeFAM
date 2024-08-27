package com.izg.back_end.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@Controller
public class GalleryController {
	
	@PostMapping("/gallery")
	public String imgSave(@RequestBody String entity) {
		
		
		return entity;
	}
	
}
