package com.izg.back_end.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.model.JoiningModel;
import com.izg.back_end.repository.JoiningRepository;

@Service
public class JoiningService {

    @Autowired
    private JoiningRepository joiningRepository;

    public JoiningModel getJoiningByUserId(String userId) {
        return joiningRepository.findByUserId(userId);
    }
}
