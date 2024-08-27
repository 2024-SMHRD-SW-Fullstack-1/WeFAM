//package com.izg.back_end.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.izg.back_end.model.MemoModel;
//import com.izg.back_end.service.MemoService;
//
//@RestController
//@CrossOrigin
//public class MemoController {
//	
//	@Autowired
//	private MemoService memoService;
//	
//	@PostMapping("/add-memo")
//		public MemoModel addMemo(@RequestBody MemoModel mm) {
//		
//		System.out.println("Received memo : " + mm);
//		
//		// 저장 후 반환
//		MemoModel addedMemo = memoService.addMemo(mm);
//		System.out.println("Added memo : " + mm);
//		
//		return addedMemo;
//	}
//}
