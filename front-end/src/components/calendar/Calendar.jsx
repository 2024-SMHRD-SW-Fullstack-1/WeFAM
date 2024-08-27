import React, { useState, useEffect, useRef } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import EventModal from "./EventModal";
import { BsSearch, BsCalendarPlus } from "react-icons/bs";
import styles from "./Calendar.module.css";

const Calendar = () => {
  const calendarRef = useRef(null); // FullCalendar를 가리킬 ref
  const [holidays, setHolidays] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 열림/닫힘 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false); // 검색창 보임 여부 상태

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Event 122",
      start: "2024-08-01",
      backgroundColor: "#1abc9c",
    },
    {
      id: 2,
      title: "Event 2",
      start: "2024-08-15",
      backgroundColor: "#3498db",
    },
    {
      id: 3,
      title: "Meeting",
      start: "2024-08-18",
      backgroundColor: "#e74c3c",
    },
    {
      id: 4,
      title: "확인용1",
      start: "2024-08-22",
      end: "2024-08-28", // 시간 정보 추가
      backgroundColor: "#1abc9c",
    },
    {
      id: 5,
      title: "출장",
      start: "2024-08-21T09:00:00",
      end: "2024-08-21T15:00:00", // 시간 정보 추가
      backgroundColor: "#2c3e50",
    },
    {
      id: 6,
      title: "여름 휴가",
      start: "2024-08-29",
      end: "2024-09-02", // 시간 정보 추가
      backgroundColor: "#9b59b6",
    },
    {
      id: 7,
      title: "해외 출장",
      start: "2024-08-04",
      end: "2024-08-13", // 시간 정보 추가
      backgroundColor: "#f39c12",
    },
  ]);

  useEffect(() => {
    const year = new Date().getFullYear(); // 현재 연도를 기준으로 데이터 호출

    // API 호출 함수
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(
          `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo`,
          {
            params: {
              solYear: year,
              numOfRows: 0, // 최대 100개의 공휴일 데이터를 가져옴
              _type: "json",
              ServiceKey:
                "I3GsqBPcPMRFC5X+f4CwHDDAlbrdlj4xF8U9EmfWAJwkMQI7tm9rbSrPfo4lm1QdvIBcWBwU5375scGyeT/hiA==",
            },
          }
        );

        const items = response?.data?.response?.body?.items?.item || [];

        // 공휴일 데이터를 'items'에서 가져와 그룹화 처리 후 holidays 상태에 저장
        const groupByDateName = (items) => {
          return items.reduce((acc, item) => {
            const locDateString = item.locdate.toString(); // YYYYMMDD 형식
            const year = locDateString.slice(0, 4);
            const month = locDateString.slice(4, 6);
            const day = locDateString.slice(6, 8);

            const formattedDate = `${year}-${month}-${day}`; // YYYY-MM-DD 형식으로 변환

            if (!acc[item.dateName]) {
              acc[item.dateName] = [];
            }

            acc[item.dateName].push(formattedDate);
            return acc;
          }, {});
        };

        const holidaysData = Object.entries(groupByDateName(items)).map(
          ([dateName, dates]) => {
            // 날짜 배열을 오름차순으로 정렬하여 시작일과 종료일을 구합니다.
            dates.sort();

            const start = dates[0]; // 가장 빠른 날짜가 시작일
            const endDate = new Date(dates[dates.length - 1]); // 가장 늦은 날짜가 종료일
            endDate.setDate(endDate.getDate() + 1); // 종료일을 다음 날로 설정

            return {
              title: dateName,
              start: start, // 시작 날짜
              end: endDate.toISOString().split("T")[0], // 종료 날짜 (포함되도록 다음 날로 설정)
              allDay: true,
              backgroundColor: "#FF4D4D",
              editable: false,
              isHoliday: true, // 공휴일 여부 플래그 추가
            };
          }
        );

        // 상태 업데이트
        setHolidays(holidaysData);
      } catch (error) {
        console.error("Error fetching holidays", error);
      }
    };

    fetchHolidays();
  }, []);

  // 새로운 이벤트 추가 함수
  const addNewEvent = () => {
    const calendarApi = calendarRef.current.getApi(); // FullCalendar API 호출
    const newEventId = events.length + 1; // 새로운 이벤트 ID 생성
    const today = new Date(); // 현재 날짜
    console.log("오늘", today);

    const newEvent = {
      id: newEventId,
      title: "제목",
      start: today, // 오늘 날짜 (시간 포함)
      end: new Date(today.getTime() + 60 * 60 * 1000), // 1시간 뒤 종료
      backgroundColor: "#ff6b6b", // 새로운 색상
    };

    // 이벤트를 FullCalendar에 추가
    calendarApi.addEvent(newEvent);

    // 상태 업데이트
    setEvents([...events, newEvent]);
  };

  // 모달에서 저장된 이벤트를 처리하는 함수
  const handleSave = (updatedEvent) => {
    console.log("Updated Event333:", updatedEvent.id); // 디버그용 로그 추가

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setIsModalOpen(false);
    // 이벤트를 강제로 다시 렌더링
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const eventToUpdate = calendarApi.getEventById(updatedEvent.id);

      if (eventToUpdate) {
        eventToUpdate.setProp("backgroundColor", updatedEvent.backgroundColor);
      }
    }
  };

  // 상태 업데이트가 완료된 후 이벤트 상태를 확인하는 useEffect
  useEffect(() => {
    console.log("Updated Events State after change:", events);
  }, [events]);

  // 이벤트 클릭 시 모달을 열고 선택된 이벤트 저장
  const handleEventClick = (clickInfo) => {
    console.log("clickInfo:", clickInfo); // 전체 클릭 정보 출력
    if (!clickInfo || !clickInfo.event) {
      console.error("clickInfo or event is undefined:", clickInfo);
      return;
    }

    console.log("Event ID:", clickInfo.event._def.publicId); // 이벤트 ID 출력
    console.log("Event title:", clickInfo.event.title); // 이벤트 제목 출력
    console.log("Event start:", clickInfo.event.start); // 이벤트 시작 시간 출력

    console.log(
      "Clicked Event backgroundColor:",
      clickInfo.event.backgroundColor
    );

    setSelectedEvent({
      id: clickInfo.event._def.publicId,
      title: clickInfo.event.title,
      start:
        clickInfo.event.startStr ||
        clickInfo.event.start.toISOString().split("T")[0], // startStr이 없으면 start를 사용
      end:
        clickInfo.event.endStr ||
        clickInfo.event.end?.toISOString().split("T")[0] ||
        clickInfo.event.start.toISOString().split("T")[0], // endStr이 없으면 end 또는 start를 사용
      backgroundColor: clickInfo.event.backgroundColor,
    });
    setIsModalOpen(true);
  };

  const renderDayCellContent = (info) => {
    const dayOfWeek = info.date.toLocaleDateString("en-US", {
      weekday: "short",
    }); // 'Sat', 'Sun' 등으로 요일 텍스트 가져옴
    let color = "";

    // 'Sat'이 포함되면 파란색, 'Sun'이 포함되면 빨간색 설정
    if (dayOfWeek.includes("Sat")) {
      color = "#2F76F9"; // 토요일: 파란색
    } else if (dayOfWeek.includes("Sun")) {
      color = "#FF4D4D"; // 일요일: 빨간색
    }

    return (
      <div style={{ color: color }}>
        {info.dayNumberText.replace("일", "")} {/* 날짜 번호에서 '일' 제거 */}
      </div>
    );
  };

  return (
    <div className='main'>
      {/* 검색 기능 */}
      <div style={{ width: "90%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "6px",
            padding: "5px",
          }}>
          <input
            type='text'
            placeholder='일정 검색'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
            className={`${styles["search-input"]} ${
              isSearchVisible ? styles["active"] : ""
            }`} // 애니메이션 클래스 적용
          />
          {/*검색 아이콘 */}
          <BsSearch
            style={{ fontSize: "24px", cursor: "pointer" }}
            onClick={() => setIsSearchVisible(!isSearchVisible)} // 클릭 시 검색창 보이기/숨기기
          />
          {/*일정 추가 아이콘 */}
          <BsCalendarPlus style={{ fontSize: "24px" }} onClick={addNewEvent} />
        </div>
        <FullCalendar
          ref={calendarRef} // ref 연결
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView='dayGridMonth'
          locale='ko'
          nowIndicator={true}
          selectable={true}
          headerToolbar={{
            left: "title",
            center: "prev,today,next",
            right: "dayGridMonth,timeGridWeek",
          }}
          // customButtons={{
          //   customButton: {
          //     text: "일정 추가", // 버튼 텍스트
          //     click: () => alert("일정 추가"), // 버튼 클릭 시 동작
          //   },
          // }}
          editable={true}
          buttonText={{
            today: "오늘",
            month: "월간",
            week: "주간",
            day: "일간",
            allDay: "하루종일",
          }}
          height='85vh'
          // dayHeaderContent={renderDayHeaderContent} // 요일 헤더 커스터마이징
          dayCellContent={renderDayCellContent}
          allDaySlot={true}
          droppable={true}
          weekends={true}
          eventTimeFormat={true}
          events={[...holidays, ...events]}
          eventClick={handleEventClick}
        />

        {/* 모달이 열렸을 때만 EventModal 컴포넌트 렌더링 */}
        {isModalOpen && (
          <EventModal
            event={selectedEvent}
            onSave={handleSave}
            onClose={() => setIsModalOpen(false)} // 모달 닫기 함수 전달
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;
