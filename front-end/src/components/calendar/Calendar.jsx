import React, { useState, useEffect } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import EventModal from "./EventModal";

const Calendar = () => {
  const [holidays, setHolidays] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 열림/닫힘 상태
  const [searchTerm, setSearchTerm] = useState("");

  const [events, setEvents] = useState([
    { title: "Event 122", start: "2024-08-01" },
    { title: "Event 2", start: "2024-08-15" },
    { title: "Meeting", start: "2024-08-18" },
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

  // 검색 기능
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  // 필터된 이벤트
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm)
  );

  // 이벤트 클릭 시 모달을 열고 선택된 이벤트 저장
  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      start:
        clickInfo.event.startStr ||
        clickInfo.event.start.toISOString().split("T")[0], // startStr이 없으면 start를 사용
      end:
        clickInfo.event.endStr ||
        clickInfo.event.end?.toISOString().split("T")[0] ||
        clickInfo.event.start.toISOString().split("T")[0], // endStr이 없으면 end 또는 start를 사용
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
      color = "blue"; // 토요일: 파란색
    } else if (dayOfWeek.includes("Sun")) {
      color = "red"; // 일요일: 빨간색
    }

    return (
      <div style={{ color: color }}>
        {info.dayNumberText.replace("일", "")} {/* 날짜 번호에서 '일' 제거 */}
      </div>
    );
  };

  return (
    <div className="main">
      <div style={{ width: "90%" }}>
        {/* 검색 기능 */}
        <div style={{ marginTop: "10px", textAlign: "left" }}>
          <input
            type="text"
            placeholder="일정을 검색하세요~"
            value={searchTerm}
            onChange={handleSearch}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              width: "150px",
            }}
          />
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          nowIndicator={true}
          selectable={true}
          allday={false}
          headerToolbar={{
            left: "title,customButton",
            center: "prev,today,next",
            right: "dayGridMonth,timeGridWeek",
          }}
          customButtons={{
            customButton: {
              text: "일정 추가", // 버튼 텍스트
              click: () => alert("일정 추가"), // 버튼 클릭 시 동작
            },
          }}
          editable={true}
          buttonText={{
            today: "오늘",
            month: "월간",
            week: "주간",
            day: "일간",
            allDay: "하루종일",
          }}
          height="90vh"
          // dayHeaderContent={renderDayHeaderContent} // 요일 헤더 커스터마이징
          dayCellContent={renderDayCellContent}
          allDaySlot={true}
          droppable={true}
          allDay={true}
          weekends={true}
          events={[
            ...holidays, // 공휴일 데이터를 FullCalendar에 전달
            ...events,
            {
              title: "확인용1",
              start: "2024-08-22",
              end: "2024-08-28", // 시간 정보 추가
              backgroundColor: "#cecece",
            },
            {
              title: "출장",
              start: "2024-08-21",
              end: "2024-08-24", // 시간 정보 추가
              backgroundColor: "#c9e812",
            },
            {
              title: "여름 휴가",
              start: "2024-08-29",
              end: "2024-09-02", // 시간 정보 추가
              backgroundColor: "var(--color-coral)",
            },
            {
              title: "해외 출장",
              start: "2024-08-04",
              end: "2024-08-13", // 시간 정보 추가
            },
          ]}
          eventClick={handleEventClick}
        />
        {/* 모달이 열렸을 때만 EventModal 컴포넌트 렌더링 */}
        {isModalOpen && (
          <EventModal
            event={selectedEvent}
            onClose={() => setIsModalOpen(false)} // 모달 닫기 함수 전달
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;
