package com.izg.back_end.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.model.EventModel;
import com.izg.back_end.repository.EventRepository;

@Service
public class EventService {
	
	@Autowired
	EventRepository eventRepository;
	EventModel eventModel;
	
	
	public List<EventModel> getEventList() {
		return	eventRepository.findAll();
		
	}
	
	//일정 추가 삭제
	public EventModel updateEvent(EventModel eventModel) {
		return eventRepository.save(eventModel);
	}
	
	//특정 일정 조회
	public Optional<EventModel> getEventById(int eventIdx) {
		return eventRepository.findById(eventIdx);
	}
}
