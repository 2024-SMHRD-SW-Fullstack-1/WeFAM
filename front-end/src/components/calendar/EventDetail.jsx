import React from "react";
import styles from "./EventDetail.module.css";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { BsXLg, BsThreeDotsVertical, BsChevronRight } from "react-icons/bs";

const EventDetail = ({ event, onClose, onDelete, onEdit }) => {
  const eventColor = event.backgroundColor;
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 메뉴 열림/닫힘 상태
  const [eventData, setEventData] = useState(event); // event prop을 상태로 관리

  useEffect(() => {
    setEventData(event); // event prop이 변경될 때마다 eventData를 업데이트
  }, [event]);

  // 메뉴 클릭 핸들러
  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString(); // 월은 0부터 시작하므로 +1
    const day = date.getDate().toString();
    const weekday = date.toLocaleDateString("ko-KR", { weekday: "short" });

    return `${year}/${month}/${day} (${weekday})`;
  };

  // 시간을 "11:00" 형식으로 반환 (오전/오후 없이)
  const formatTime = (date, includeAMPM = true) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // 오전/오후를 반환
  const formatAMPM = (date) => {
    const hours = date.getHours();
    return hours >= 12 ? "오후" : "오전";
  };

  return ReactDOM.createPortal(
    <div className={styles.EventDetail} onClick={(e) => e.stopPropagation()}>
      {/* Header 부분 */}
      <div className={styles.header}>
        <div className={styles.icon}>
          <BsXLg onClick={onClose} />
        </div>
        <div className={styles.icon} style={{ marginLeft: "auto" }}>
          <BsThreeDotsVertical onClick={handleMenuClick} />
          {isMenuOpen && (
            <div className={styles.menu}>
              <div onClick={onEdit}>수정</div>
              <div onClick={onDelete}>삭제</div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.title}>
        <h2 style={{ color: eventColor }}>{event.title}</h2>
      </div>
      {/** 일정 기간 */}
      <div
        className={`${styles.details} ${
          event.start !== event.end ? "hasTime" : "noTime"
        } ${event.allDay ? styles.allDay : ""}`}>
        <div className={styles.dateTime}>
          <span className={styles.startDate}>{formatDate(event.start)}</span>
          {!event.allDay && ( // allDay가 false일 때만 시간 표시
            <span className={styles.startTime}>
              <span className={styles.time}>
                {formatTime(event.start, false)}
              </span>
              <span className={styles.ampm}>{formatAMPM(event.start)}</span>
            </span>
          )}
        </div>

        <BsChevronRight
          className={styles.arrow}
          style={{ color: eventColor }}
        />

        <div className={styles.dateTime}>
          <span className={styles.endDate}>{formatDate(event.end)}</span>
          {!event.allDay && ( // allDay가 false일 때만 시간 표시
            <span className={styles.endTime}>
              <span className={styles.time}>
                {formatTime(event.end, false)}
              </span>
              <span className={styles.ampm}>{formatAMPM(event.end)}</span>
            </span>
          )}
        </div>
      </div>
      {/* Content 부분 */}
      <div className={styles.content}>
        <p>{event.content}</p>
      </div>

      {/* Comment 부분 */}
      <div className={styles.commentSection}>
        <div className={styles.comment}>
          <span>작성자: {event.userId}</span>
          <span>일정을 등록했습니다</span>
          <span>
            {new Date(event.start).toLocaleDateString()}{" "}
            {new Date(event.start).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>,
    document.body // 모달을 body에 추가
  );
};

export default EventDetail;
