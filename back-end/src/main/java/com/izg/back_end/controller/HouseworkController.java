package com.izg.back_end.controller;

import java.util.List;
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

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class HouseworkController {

   private final HouseworkRepository houseWorkRepository;
   private final HouseworkService houseWorkService;

   @PostMapping("/add-work")
   public HouseworkModel addWork(@RequestBody HouseworkModel houseWorkModel) {
      HouseworkModel work = houseWorkRepository.save(houseWorkModel);
      System.out.println("work : " + work);
      return work;
   }
   
   @GetMapping("/get-works")
   public List<HouseworkModel> getAllWorks() {
      return houseWorkService.getAllWorks();
   }

   @PutMapping("/update-work/{workIdx}")
   public HouseworkModel updateWork(@PathVariable("workIdx") int workIdx, @RequestBody HouseworkModel houseWorkModel) {
      Optional<HouseworkModel> existingWork = houseWorkService.getWorkById(workIdx);
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

