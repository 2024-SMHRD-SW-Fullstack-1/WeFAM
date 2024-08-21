package com.izg.back_end.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.izg.back_end.model.EventModel;
import com.izg.back_end.repository.EventRepository;

@Service
public class EventService {

	@Autowired
	EventRepository eventRepository;

	// 일정 추가
	public EventModel addEvent(EventModel ev) {
		return eventRepository.save(ev);
	}
	
	@Transactional
    public void updateEvent(EventModel event) {
        // 이벤트가 존재하는 경우 업데이트
        if (event.getEIdx() > 0 && eventRepository.existsById(event.getEIdx())) {
            eventRepository.updateEvent(
                event.getEIdx(),
                event.getTitle(),
                event.getStartDate(),
                event.getEndDate(),
                event.getContent()
            );
        } else {
            // 이벤트가 존재하지 않으면 예외를 던지거나 추가 로직을 처리할 수 있습니다.
            throw new RuntimeException("Event with ID " + event.getEIdx() + " does not exist.");
        }
    }
	
	// 선택된 하루의 일정 찾기 (멤버 조건없이 모두 조회)
//	public List<EventModel> getEventsByDate(String date) {
//        LocalDate localDate = LocalDate.parse(date);
//        LocalDateTime startOfDay = localDate.atStartOfDay(); // 날짜 00:00:00
//        LocalDateTime endOfDay = localDate.atTime(LocalTime.MAX); // 날짜 23:59:59
//        System.out.println("parsed startOfDay : " + startOfDay.toString());
//        System.out.println("parsed endOfDay : " + endOfDay.toString());
//
//        return eventRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(endOfDay, startOfDay);
//    }
	// 선택된 날짜의 일정 조회 (멤버 조건으로 조회)
	public List<EventModel> getEventsByDate(String date, int mIdx) {
        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime startOfDay = localDate.atStartOfDay(); // 날짜 00:00:00
        LocalDateTime endOfDay = localDate.atTime(LocalTime.MAX); // 날짜 23:59:59
        
        return eventRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqualAndMIdx(endOfDay, startOfDay, mIdx);
    }
		
	// 일정 모두 찾기
	public List<EventModel> getAllEvents(int mIdx) {
        return eventRepository.findByMIdx(mIdx);
    }
	
	@Transactional
    public void deleteEvent(int eIdx) {
        eventRepository.deleteByEIdx(eIdx);
    }
}
