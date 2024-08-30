import React, { useState, useEffect, useRef } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import EventModal from "./EventModal";
import { BsSearch, BsCalendarPlus } from "react-icons/bs";
import styles from "./Calendar.module.css";
import EventDetail from "./EventDetail";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";

const Calendar = () => {
  const calendarRef = useRef(null); // FullCalendar를 가리킬 ref
  const [holidays, setHolidays] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 열림/닫힘 상태
  const [isEventOpen, setIsEventOpen] = useState(false); // 일정 창 열림/닫힘 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false); // 검색창 보임 여부 상태
  const [events, setEvents] = useState([]);
  let clickTimeout = null;

  const userData = useSelector((state) => state.user.userData);

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

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8089/wefam/calendar");
      const fullCalendarEvents = response.data.map((event) => {
        const startDate = new Date(`${event.eventStDt}T${event.eventStTm}`);
        const endDate = new Date(`${event.eventEdDt}T${event.eventEdTm}`);

        return {
          id: event.eventIdx,
          title: event.eventTitle,
          start: startDate.toISOString(), // ISO 8601 형식으로 변환
          end: endDate.toISOString(), // ISO 8601 형식으로 변환
          backgroundColor: event.eventColor,
          familyIdx: event.familyIdx,
          userId: event.userId,
          content: event.eventContent || "",
          location: event.location || "",
          isholiday: false,
          classNames: ["custom-dot-event"],
          allDay: event.isAllDay == 1,
        };
      });

      setEvents(fullCalendarEvents);
      console.log("dd", response.data);

      console.log("불러오기", events);
    } catch (error) {
      console.error("Error fetching events:", error); // 오류 로그 추가
    }
  };
  console.log(" gㅏㄹ엊ㄹ01", events);

  useEffect(() => {
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

  // 일정 저장
  const saveEvent = async (updatedEvent) => {
    // 날짜와 시간을 분리하여 서버에 보낼 형식으로 변환
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    console.log("업데이트", updatedEvent);

    // 날짜와 시간으로 분리
    const eventToSave = {
      ...updatedEvent,
      eventContent: updatedEvent.content,
      eventTitle: updatedEvent.title,
      eventStDt: formatDate(new Date(updatedEvent.start)),
      eventStTm: formatTime(new Date(updatedEvent.start)),
      eventEdDt: formatDate(new Date(updatedEvent.end)),
      eventEdTm: formatTime(new Date(updatedEvent.end)),
      eventColor: updatedEvent.backgroundColor, // 필드명 맞춤
    };

    const eventIdx = updatedEvent.id;
    try {
      if (eventIdx) {
        const response = await axios.post(
          `http://localhost:8089/wefam/update-event/${eventIdx}`,
          eventToSave,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        await fetchEvents();
        toast.success("일정이 성공적으로 업데이트되었습니다!"); // 성공 토스트 메시지
        setIsModalOpen(false);
        console.log("응답 데이터", response.data);
        console.log("업데이트된 이벤트", updatedEvent);
      } else {
        const response = await axios.post(
          `http://localhost:8089/wefam/add-event`,
          eventToSave,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        await fetchEvents();

        setIsModalOpen(false);
        console.log("응답 데이터", response.data);
        console.log("업데이트된 이벤트", updatedEvent);
      }
    } catch (error) {
      console.error("Error updating event:", error); // 에러 처리}
    }
  };

  const handleDeleteClick = () => {
    const eventIdx = selectedEvent.id;
    console.log(eventIdx);
  };

  const handleEventClick = (clickInfo) => {
    // start와 end 시간이 존재할 경우 시간을 추출하여 문자열로 변환
    const formatTime = (date) => {
      if (!date) return null; // date가 없으면 null 반환
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    const { extendedProps } = clickInfo.event; // extendedProps에서 추가 데이터 추출
    const eventEnd = clickInfo.event.end;

    console.log("이벤트 종료 시간:", eventEnd); // 종료 시간 확인

    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start, // 원래 날짜
      startTime: formatTime(clickInfo.event.start), // 시간 추출

      end: clickInfo.event.end || clickInfo.event.start, // 원래 날짜
      endTime:
        formatTime(clickInfo.event.end) || formatTime(clickInfo.event.start), // 시간 추출

      allDay: clickInfo.event.allDay, // allDay 여부
      backgroundColor: clickInfo.event.backgroundColor,
      familyIdx: extendedProps.familyIdx, // extendedProps에서 familyIdx 가져오기
      content: extendedProps.content, // extendedProps에서 content 가져오기
      userId: extendedProps.userId, // extendedProps에서 userId 가져오기
    });

    setIsEventOpen(true);
  };

  // 이벤트 클릭 시 모달을 열고 선택된 이벤트 저장
  const handleEditClick = () => {
    if (!selectedEvent) {
      console.error("clickInfo.event is undefined");
      return;
    }

    setIsModalOpen(true);
  };

  useEffect(() => {
    console.log("업데이트된 selectedEvent 상태:", selectedEvent);
  }, [selectedEvent]);

  //추가
  const handleAddEventClick = () => {
    setSelectedEvent({
      start: new Date(),
      end: new Date(),

      backgroundColor: "#FF4D4D",
      allDay: false,
      // userId: UserId,
      // familyIdx: familyIdx,
    });
    setIsModalOpen(true);
    setIsEventOpen(false);
  };

  // 날짜 셀을 더블클릭했을 때 이벤트 추가를 위한 모달 열기 함수
  const handleDateDoubleClick = (info) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      setSelectedEvent({
        start: info.date,
        end: info.date,
        backgroundColor: "#FF4D4D",
        allDay: false,
        familyIdx: 1,
        // userId: userData.id,
      });
      setIsModalOpen(true);
      setIsEventOpen(false);
    } else {
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
      }, 300); // 더블클릭을 감지하기 위한 300ms 대기
    }
  };

  const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    const sameDate = startDate.toDateString() === endDate.toDateString();

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
        }}>
        {/* allDay가 true이거나 날짜가 다를 때 바 형태로 표시 */}
        {event.allDay || !sameDate ? (
          <>
            <div
              style={{
                width: "100%",
                height: "16px",
                backgroundColor: event.backgroundColor || "#FF4D4D",
                borderRadius: "2px",
                position: "relative",
              }}>
              <span
                style={{
                  position: "relative",
                  height: "100%",
                  left: "10px",
                  right: "10px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "8px",
                  color: "#fff", // 바 형태에서는 흰색 글씨로 표시
                }}>
                {event.title}
              </span>
            </div>
          </>
        ) : (
          <>
            {/* allDay가 false이면서 날짜가 같을 때 도트와 시간 표시 */}
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
            <span
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                flexGrow: 1, // 제목이 가능한 공간을 많이 차지하도록
                minWidth: "0",
              }}>
              {event.title}
            </span>

            <span
              style={{
                textAlign: "right",
                fontSize: "0.9em",
                color: "#666",
                flexShrink: 0,
              }}>
              {startTime}
            </span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className='main'>
      {/* ToastContainer는 루트 컴포넌트에 포함 */}
      <ToastContainer
        position='bottom-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        z-index='100'
      />

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
          <BsCalendarPlus
            style={{ fontSize: "24px" }}
            onClick={handleAddEventClick}
          />
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
          editable={true}
          buttonText={{
            today: "오늘",
            month: "월간",
            week: "주간",
            day: "일간",
            allDay: "하루종일",
          }}
          height='85vh'
          dayCellContent={renderDayCellContent}
          allDaySlot={true}
          droppable={true}
          weekends={true}
          eventTimeFormat={true}
          events={[...holidays, ...events]}
          // eventClick={handleEventClick}
          // 일정 클릭 시 EventInfo 컴포넌트를 열기 위한 함수
          eventClick={handleEventClick}
          // 날짜 셀 클릭 시 새로운 이벤트를 추가하기 위한 모달 열기
          dateClick={handleDateDoubleClick}
          dayMaxEvents={3}
          moreLinkClick='popover' // 'View More' 클릭 시 팝업으로 나머지 일정 표시
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

        {/* 모달이 열렸을 때만 EventModal 컴포넌트 렌더링 */}
        {isEventOpen && (
          <EventDetail
            key={selectedEvent.id}
            event={selectedEvent}
            // onSave={saveEvent}
            onDelete={handleDeleteClick} // 삭제 버튼에 사용할 함수
            onEdit={handleEditClick} // 수정 버튼에 사용할 함수
            onClose={() => setIsEventOpen(false)} // 모달 닫기 함수 전달
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;
