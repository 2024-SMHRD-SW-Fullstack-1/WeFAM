package com.izg.back_end.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.model.EventModel;
import com.izg.back_end.repository.EventRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class EventService {
	
	@Autowired
	EventRepository eventRepository;
	EventModel eventModel;
	
	
	public List<EventModel> getEventList() {
		return	eventRepository.findAll();
		
	}
	
	@Transactional
	public void updateEvent(int eventIdx,String newId, String newTitle, LocalDate newStartDate, LocalTime newStartTime,
			LocalDate newEndDate, LocalTime newEndTime, String newColor, String newLocation, String newContent) {
		// 1. 이벤트 조회
		Optional<EventModel> optionalEvent = eventRepository.findById(eventIdx);

		if (optionalEvent.isPresent()) {
			// 2. 조회된 이벤트가 있을 경우 필드 수정
			EventModel event = optionalEvent.get();
			event.setEventTitle(newTitle);
			event.setUserId(newId);
			event.setEventStDt(newStartDate);
			event.setEventStTm(newStartTime);
			event.setEventEdDt(newEndDate);
			event.setEventEdTm(newEndTime);
			event.setEventColor(newColor);
			event.setEventLocation(newLocation);
			event.setEventContent(newContent);

			// 3. save 호출 없이 JPA가 트랜잭션이 끝날 때 자동으로 업데이트합니다.
		} else {
			throw new EntityNotFoundException("Event not found for eventIdx: " + eventIdx);
		}
	}
}
