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
	
    @PostMapping("/add-event")
    public EventModel updateEvent(@RequestBody EventModel em) {
		System.out.println("Received Feed : " + em);
		
		EventModel addedEvent = eventService.updateEvent(em);;
		return addedEvent;
    }
}
