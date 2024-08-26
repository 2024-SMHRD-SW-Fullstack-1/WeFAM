import React, { useEffect, useState } from "react";
import styles from "./EventModal.module.css"; // 모달 관련 CSS
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // DatePicker 스타일
import {
  BsEyedropper,
  BsPeople,
  BsClock,
  BsPaperclip,
  BsAlarm,
  BsPinMap,
  BsPersonCircle,
  BsThreeDotsVertical,
} from "react-icons/bs";
import CustomDropdown from "./CustomDropDown";
import AlarmSetting from "./alarmSetting";

const EventModal = ({ event, onClose }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false); // 상세 설정 상태 관리
  const [selectedColor, setSelectedColor] = useState("#FF4D4D");
  const [showAlarmSetting, setShowAlarmSetting] = useState(false); // 알림 설정 표시 여부
  const [alarmText, setAlarmText] = useState("알림 없음"); // 알림 상태에 따른 텍스트

  // CustomDropdown의 onChange 이벤트에서 올바른 color 값을 가져와 상태 업데이트
  const handleColorChange = (selectedOption) => {
    if (selectedOption && selectedOption.color) {
      setSelectedColor(selectedOption.color); // 선택된 색상 값을 저장
    } else {
      console.error("Color option is not available.");
    }
  };

  // 상세 설정 버튼 클릭 시 토글
  const toggleDetail = () => {
    setIsDetailOpen((prevState) => !prevState);
  };
  const toggleAlarmSetting = () => {
    setShowAlarmSetting((prevState) => !prevState); // 알림 설정 토글
    setAlarmText(showAlarmSetting ? "알림 없음" : "10분 전"); // 알림 상태 텍스트 변경
  };

  const colorOptions = [
    { value: "emerald", label: "에메랄드 그린", color: "#2ecc71" },
    { value: "cyan", label: "모던 사이언", color: "#1abc9c" },
    { value: "skyblue", label: "딥 스카이블루", color: "#3498db" },
    { value: "brown", label: "파스텔 브라운", color: "#d35400" },
    { value: "black", label: "미드나잇 블랙", color: "#2c3e50" },
    { value: "red", label: "애플 레드", color: "#e74c3c" },
    { value: "rose", label: "프렌치 로즈", color: "#e84393" },
    { value: "pink", label: "코랄 핑크", color: "#ff6b6b" },
    { value: "orange", label: "브라이트 오렌지", color: "#f39c12" },
    { value: "violet", label: "소프트 바이올렛", color: "#9b59b6" },
  ];
  // selectedColor가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log("Selected color updated:", selectedColor);
  }, [selectedColor]); // selectedColor가 변경될 때마다 useEffect 실행

  const timeOptions = [
    "오전 12:00",
    "오후 12:30",
    "오후 1:00",
    "오후 1:30",
    "오후 2:00",
    "오후 2:30",
    "오후 3:00",
    "오후 3:30",
    "오후 4:00",
    "오후 4:30",
    "오후 5:00",
    "오후 5:30",
    "오후 6:00",
    "오후 6:30",
    "오후 7:00",
    "오후 7:30",
    "오후 8:00",
    "오후 8:30",
    "오후 9:00",
    "오후 9:30",
    "오후 10:00",
    "오후 10:30",
    "오후 11:00",
    "오후 11:30",
  ];

  const [startDate, setStartDate] = useState(new Date(event.start));
  const [endDate, setEndDate] = useState(new Date(event.end));
  const [startTime, setStartTime] = useState("오전 0:00");
  const [endTime, setEndTime] = useState("오후 0:00");

  return (
    <div className={styles.modal}>
      <div className={styles["modal-content"]}>
        {/* 제목 */}
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{event.title}</h2>
          <BsThreeDotsVertical className={styles.threeDots} />
        </div>

        {/* 날짜 및 시간 */}
        <div className={styles.dateTimeSection}>
          <BsClock
            className={styles.icon}
            style={{ color: selectedColor }} // 선택된 색상이 없으면 기본값
          />
          <div className={styles.dateTimeContainer}>
            {/* 시작 날짜 */}

            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat='yyyy년 MM월 dd일'
              className={styles.dateInput}
            />
            {/* 시작 시간 */}
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={styles.timeInput}>
              {timeOptions.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {/* 중간 구분 기호 */}
            <span> - </span>
            {/* 종료 시간 */}
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={styles.timeInput}>
              {timeOptions.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {/* 종료 날짜 */}
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat='yyyy년 MM월 dd일'
              className={styles.dateInput}
            />
          </div>
        </div>

        {/* 작성자, 그룹, 코알 필드 */}
        <div className={styles.field}>
          <BsPersonCircle
            className={styles.icon}
            style={{ color: selectedColor }} // 선택된 색상이 없으면 기본값
          />
          <span>작성자</span>
        </div>

        {/**사용자 */}
        <div className={styles.field}>
          <BsPeople
            className={styles.icon}
            style={{ color: selectedColor }} // 선택된 색상이 없으면 기본값
          />
          <span>그룹</span>
        </div>

        {/* 색상 선택 */}
        <div className={styles.field}>
          <BsEyedropper
            className={styles.icon}
            style={{ color: selectedColor }}
          />
          <CustomDropdown
            options={colorOptions}
            onChange={handleColorChange} // 선택된 값을 넘김
            placeholder='색상을 선택하세요'
          />
        </div>

        {/* 상세 설정 버튼 */}
        {!isDetailOpen && (
          <div className={styles.detailContainer}>
            <button
              onClick={toggleDetail}
              className={styles.detailButton}
              style={{ color: selectedColor }} // 선택된 색상이 없으면 기본값
            >
              상세 설정
            </button>
          </div>
        )}

        {/* 상세 설정 열렸을 때 */}
        {isDetailOpen && (
          <div className={styles.detailSection}>
            {/*알림 설정 */}
            <div className={styles.field}>
              {/* 알림 설정 필드 */}
              <div className={styles.contentField}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={toggleAlarmSetting} // 클릭 시 드롭다운처럼 열리도록
                >
                  <BsAlarm
                    className={styles.icon}
                    style={{ color: selectedColor }}
                  />
                  <span>{alarmText}</span>
                </div>
              </div>

              {/* 클릭 시 알림 설정 UI */}
              {showAlarmSetting && (
                <div
                  style={{
                    position: "absolute", // 절대 위치 설정
                    zIndex: 1, // 다른 요소 위로 배치
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #e0e0e0",
                    borderRadius: "5px",
                    padding: "10px",
                    marginTop: "5px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 그림자 추가
                    width: "100%", // 필드 너비에 맞추기
                  }}>
                  <AlarmSetting />
                </div>
              )}
            </div>

            {/*지도 설정 */}
            <div className={styles.field}>
              <BsPinMap
                className={styles.icon}
                style={{ color: selectedColor }} // 선택된 색상이 없으면 기본값
              />
              <span>장소</span>
            </div>

            {/*파일 첨부 */}
            <div className={styles.field}>
              <BsPaperclip
                className={styles.icon}
                style={{ color: selectedColor }} // 선택된 색상이 없으면 기본값
              />
              <span>첨부파일</span>
            </div>
          </div>
        )}

        {/* 모달 하단 버튼들 */}
        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            style={{ color: selectedColor }} // 선택된 색상이 없으면 기본값
          >
            취소
          </button>
          <button
            className={styles.saveButton}
            style={{ backgroundColor: selectedColor }} // 선택된 색상이 없으면 기본값
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
