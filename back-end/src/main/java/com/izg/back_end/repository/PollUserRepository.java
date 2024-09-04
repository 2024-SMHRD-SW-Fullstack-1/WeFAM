package com.izg.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.PollModel;
import com.izg.back_end.model.PollUserModel;

@Repository
public interface PollUserRepository extends JpaRepository<PollUserModel, Integer> {
//	PollUserModel findByPollAndUserId(PollModel poll, String userId);
//	PollUserModel findByPollAndUserId(int pollIdx, String userId);
	boolean existsByPollIdxAndUserId(int pollIdx, String userId);
}
