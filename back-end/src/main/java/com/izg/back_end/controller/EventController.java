package com.izg.back_end.controller;

import java.util.List;

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
	
    @PostMapping("/calendar/{eventIdx}")
    public ResponseEntity<String> updateEvent(@PathVariable("id") int eventIdx, @RequestBody EventModel event) {
        try {
            eventService.updateEvent(
                eventIdx, 
                event.getEventTitle(),    // 이벤트 제목
                event.getUserId(),		  // 이벤트 작성자
                event.getEventStDt(),     // 이벤트 시작 날짜
                event.getEventStTm(),     // 이벤트 시작 시간
                event.getEventEdDt(),     // 이벤트 종료 날짜
                event.getEventEdTm(),     // 이벤트 종료 시간
                event.getEventColor(),    // 이벤트 색상
                event.getEventLocation(), // 이벤트 장소
                event.getEventContent()   // 이벤트 내용
            );
            return ResponseEntity.ok("Event updated successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
