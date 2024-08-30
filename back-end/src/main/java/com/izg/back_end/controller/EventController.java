package com.izg.back_end.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.model.EventModel;
import com.izg.back_end.model.FeedModel;
import com.izg.back_end.service.EventService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@CrossOrigin
public class EventController {

	private final EventService eventService;

	@Autowired
	public EventController(EventService eventService) {
		this.eventService = eventService;
	}

	@GetMapping("/calendar")
	public List<EventModel> getEvents() {
		return eventService.getEventList();
	}
	
    @PostMapping("/update-event/{eventIdx}")
    public EventModel updateEvent(@PathVariable("eventIdx") int eventIdx, @RequestBody EventModel eventModel) {
    	Optional<EventModel> existingEvent = eventService.getEventById(eventIdx);
		if (existingEvent.isPresent()) {
			eventModel.setEventIdx(eventIdx); // 기존 ID 유지
			return eventService.updateEvent(eventModel);
		} else {
			throw new RuntimeException("작업을 찾을 수 없습니다.");
		}
    }
    
    @PostMapping("/add-event")
    public EventModel addEvent(@RequestBody EventModel eventModel) {
        return eventService.updateEvent(eventModel); // 새로운 이벤트를 추가하는 서비스 메서드 호출
    }
}
