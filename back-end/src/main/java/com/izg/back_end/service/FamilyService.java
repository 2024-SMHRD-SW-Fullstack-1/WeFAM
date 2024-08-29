package com.izg.back_end.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.model.FamilyModel;
import com.izg.back_end.repository.FamilyRepository;

@Service
public class FamilyService {

    @Autowired
    private FamilyRepository familyRepository;

    public FamilyModel getFamilyById(String id) {
        return familyRepository.findById(id);
    }
}
