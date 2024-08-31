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
  const [events, setEvents] = useState([]);

  //요일에 따른 날짜 색상
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

  // 그룹원 일정 가져오기
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8089/wefam/calendar"
        );
        const fullCalendarEvents = response.data.map((event) => {
          const startDate = new Date(`${event.eventStDt}T${event.eventStTm}`);
          const endDate = new Date(`${event.eventEdDt}T${event.eventEdTm}`);

          // 종료 날짜가 시작 날짜와 동일하고 시간이 00:00인 경우
          const isAllDay = startDate.toDateString() !== endDate.toDateString();

          // allDay 이벤트의 경우, endDate에 1일 추가 (FullCalendar 규칙 상)
          if (isAllDay) {
            endDate.setDate(endDate.getDate() + 1); // 마지막 날도 포함되도록 1일 추가
          }
          return {
            id: event.eventIdx,
            title: event.eventTitle,
            start: startDate.toISOString(), // ISO 8601 형식으로 변환
            end: endDate.toISOString(), // ISO 8601 형식으로 변환
            backgroundColor: event.eventColor,
            familyIdx: event.familyIdx,
            userId: event.userId,
            content: event.eventContent,
            location: event.location || "",
            isholiday: false,
            classNames: ["custom-dot-event"],
            allDay: isAllDay, // 날짜 범위에 따라 allDay 설정
          };
        });

        setEvents(fullCalendarEvents);
        console.log("dd", response.data);

        console.log("불러오기", events);
      } catch (error) {
        console.error("Error fetching events:", error); // 오류 로그 추가
      }
    };
    fetchEvents();
  }, []);

  // 이벤트 상태가 업데이트될 때마다 확인
  useEffect(() => {}, [events]); // 이벤트가 변경될 때마다 로그

  // 공휴일 데이터 가져오기
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
              numOfRows: 0, // 최대 0개의 공휴일 데이터를 가져옴
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

  // 모달에서 저장된 이벤트를 처리하는 함수
  const saveEvent = async (updatedEvent) => {
    console.log(updatedEvent);
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
        eventToUpdate.setStart(updatedEvent.start); // 시작 날짜 업데이트
        eventToUpdate.setEnd(updatedEvent.end); // 종료 날짜 업데이트
      }
    }

    try {
      const response = await axios.post(
        `http://localhost:8089/wefam/add-event`,
        updatedEvent
      );
      console.log(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error); // 에러 처리}
    }
  };

  // 이벤트 클릭 시 모달을 열고 선택된 이벤트 저장
  const handleEventClick = (clickInfo) => {
    // const selectedEvent = events.find(
    //   (event) => event.id === clickInfo.event.id
    // );

    // console.log("Selected event:", selectedEvent); // 선택된 이벤트 확인
    // console.log("Selected event familyIdx:", selectedEvent.familyIdx); // familyIdx 확인
    console.log("클릭함", clickInfo);

    if (!clickInfo || !clickInfo.event) {
      return;
    }

    // start와 end 시간이 존재할 경우 시간을 추출하여 문자열로 변환
    const formatTime = (date) => {
      if (!date) return null; // date가 없으면 null 반환
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };
    const { extendedProps } = clickInfo.event; // extendedProps에서 추가 데이터 추출
    // 이벤트 정보 저장 (시간도 문자열로 변환)
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start, // 원래 날짜
      startTime: formatTime(clickInfo.event.start), // 시간 추출
      end: clickInfo.event.end, // 원래 날짜
      endTime: formatTime(clickInfo.event.end), // 시간 추출
      allDay: clickInfo.event.allDay, // allDay 여부
      backgroundColor: clickInfo.event.backgroundColor,
      familyIdx: extendedProps.familyIdx, // extendedProps에서 familyIdx 가져오기
      content: extendedProps.content, // extendedProps에서 content 가져오기
      userId: extendedProps.userId, // extendedProps에서 userId 가져오기
    });
    console.log("선택 ", selectedEvent);

    setIsModalOpen(true);
  };

  //추가
  const handleAddEventClick = () => {
    setSelectedEvent({
      title: "",
      start: new Date(),
      end: new Date(),
      backgroundColor: "#FF4D4D",
      allDay: false,
    });
    setIsModalOpen(true);
  };

  const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;

    const startTime = event.start
      ? new Date(event.start).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {/* Dot */}
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: event.backgroundColor || "#FF4D4D",
            marginRight: "5px", // 도트와 타이틀 사이에 간격 추가
            flexShrink: 0,
          }}
        />
        {/* Title and Time */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              overflow: "hidden ",
              whiteSpace: "nowrap ",
              flexGrow: 1, // 제목이 가능한 공간을 많이 차지하도록
              minWidth: " 0 ",
            }}
          >
            {event.title}
          </span>
          {!event.allDay && (
            <span
              style={{
                textAlign: "right",
                fontSize: "0.9em",
                color: "#666",
                marginLeft: "10px",
                flexShrink: 0,
              }}
            >
              {startTime}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="main">
      {/* 검색 기능 */}
      <div style={{ width: "90%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "6px",
            padding: "5px",
          }}
        >
          <input
            type="text"
            placeholder="일정 검색"
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
          <BsCalendarPlus
            style={{ fontSize: "24px" }}
            onClick={handleAddEventClick}
          />
        </div>
        <FullCalendar
          ref={calendarRef} // ref 연결
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          nowIndicator={true}
          selectable={true}
          headerToolbar={{
            left: "title",
            center: "prev,today,next",
            right: "dayGridMonth,timeGridWeek",
          }}
          editable={true}
          buttonText={{
            today: "오늘",
            month: "월간",
            week: "주간",
            day: "일간",
            allDay: "하루종일",
          }}
          height="85vh"
          dayCellContent={renderDayCellContent}
          allDaySlot={true}
          droppable={true}
          weekends={true}
          eventTimeFormat={true}
          events={[...holidays, ...events]}
          eventClick={handleEventClick}
          dayMaxEvents={3}
          moreLinkClick="popover" // 'View More' 클릭 시 팝업으로 나머지 일정 표시
          eventContent={renderEventContent}
        />

        {/* 모달이 열렸을 때만 EventModal 컴포넌트 렌더링 */}
        {isModalOpen && (
          <EventModal
            event={selectedEvent}
            onSave={saveEvent}
            onClose={() => setIsModalOpen(false)} // 모달 닫기 함수 전달
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;
