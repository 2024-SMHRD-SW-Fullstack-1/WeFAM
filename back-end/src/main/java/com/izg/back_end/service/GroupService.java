package com.izg.back_end.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.model.GroupModel;
import com.izg.back_end.repository.GroupRepository;

@Service
public class GroupService {
	
	@Autowired
	GroupRepository groupRepository;
	
	public void groupAdd(GroupModel gv) {
        groupRepository.save(gv);
    }

	public List<GroupModel> getGroupsByUserId(String id) {
        return groupRepository.findBymId(id);
    }
}
