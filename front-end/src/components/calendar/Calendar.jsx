import React, { useState, useEffect } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";

const Calendar = () => {
  const [holidays, setHolidays] = useState([]);

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
              numOfRows: 100, // 최대 100개의 공휴일 데이터를 가져옴
              _type: "json",
              ServiceKey: "I3GsqBPcPMRFC5X+f4CwHDDAlbrdlj4xF8U9EmfWAJwkMQI7tm9rbSrPfo4lm1QdvIBcWBwU5375scGyeT/hiA==",
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
    <div>
      
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        locale="ko"
        nowIndicator={true}
        selectable={true}
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek",
        }}
        buttonText={{
          today: "오늘",
          month: "월간",
          week: "주간",
          day: "일간",
          allday:"하루종일",
        }}
        height="90vh"
        // dayHeaderContent={renderDayHeaderContent} // 요일 헤더 커스터마이징
        dayCellContent={renderDayCellContent}
        events={[
          ...holidays, // 공휴일 데이터를 FullCalendar에 전달
        {
          title: '확인용',
  start: '2024-08-22T00:00:00',
  end: '2024-08-28T00:00:00' // 시간 정보 추가
        },
        
        ]}
        
      />
      
    </div>
  );
};

export default Calendar;
