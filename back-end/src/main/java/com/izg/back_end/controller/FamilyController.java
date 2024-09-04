package com.izg.back_end.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.model.FamilyModel;
import com.izg.back_end.service.FamilyService;

@RestController
public class FamilyController {

    @Autowired
    private FamilyService familyService;
    


}