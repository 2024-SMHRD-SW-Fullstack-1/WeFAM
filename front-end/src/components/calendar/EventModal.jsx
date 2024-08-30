import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
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

const generateTimeOptions = () => {
  const options = [];
  let period = "오전";
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 1) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const formattedMinute = minute.toString().padStart(2, "0");
      period = hour < 12 ? "오전" : "오후";
      options.push(`${period} ${formattedHour}:${formattedMinute}`);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

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
  { value: "coral", label: "코랄", color: "#e1888b" }, // --color-coral
  { value: "peach", label: "피치", color: "#f0b49c" }, // --color-peach
  { value: "maize", label: "메이즈", color: "#f5d0a3" }, // --color-maize
  { value: "turquoise-green", label: "터쿼이즈 그린", color: "#b4fab3" }, // --color-turquoise-green
  { value: "pale-blue", label: "페일 블루", color: "#b6cfe2" }, // --color-pale-blue
];

const EventModal = ({ event, onClose, onSave }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false); // 상세 설정 상태 관리
  const [showAlarmSetting, setShowAlarmSetting] = useState(false); // 알림 설정 표시 여부
  const [alarmText, setAlarmText] = useState("10분 전"); // 알림 텍스트 기본값
  const [selectedOption, setSelectedOption] = useState(null); // 색상 선택 상태
  const [selectedColor, setSelectedColor] = useState(
    event.backgroundColor || "#FF4D4D"
  );
  const [selectedLabel, setSelectedLabel] = useState("");
  const [startDate, setStartDate] = useState(new Date(event.start));
  const [endDate, setEndDate] = useState(new Date(event.end));
  const [isAllDay, setIsAllDay] = useState(event.allDay || false); // 종일 이벤트 여부
  const [title, setTitle] = useState(event.title);

  // 입력 변경 시 상태 업데이트
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // 알림 시간이 변경될 때 호출되는 함수
  const handleAlarmChange = (time, unit) => {
    setAlarmText(`${time} ${unit}`); // 알림 텍스트 업데이트
  };

  // 저장 버튼 클릭 시 이벤트 정보를 전달
  const handleSaveClick = () => {
    console.log("Saving event with color:", selectedColor); // 디버그용 로그
    onSave({
      start: startDate, // 업데이트된 시작 날짜
      end: endDate, // 업데이트된 종료 날짜
      backgroundColor: selectedColor, // 업데이트된 색상
      title: title,
      id: event.id || "UnKnown", // ID도 함께 전달
      allDay: isAllDay,
      familyIdx: event.familyIdx,
      eventContent: event.eventContent,
      userId: event.userId,
    });
    console.log(onSave);
  };

  // 이미 존재하는 일정이면, 해당 색상의 라벨을 설정
  useEffect(() => {
    if (event && event.backgroundColor) {
      setSelectedColor(event.backgroundColor);
    }
  }, [event.backgroundColor]);

  // CustomDropdown의 onChange 이벤트에서 올바른 color 값을 가져와 상태 업데이트
  const handleColorChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setSelectedColor(selectedOption.color);
  };

  // 상세 설정 버튼 클릭 시 토글
  const toggleDetail = () => {
    setIsDetailOpen((prevState) => !prevState);
  };

  const toggleAlarmSetting = () => {
    setShowAlarmSetting((prevState) => !prevState); // 알림 설정 토글
    setAlarmText(showAlarmSetting ? "알림 없음" : "10분 전"); // 알림 상태 텍스트 변경
  };

  useEffect(() => {
    // 모달이 열릴 때, 이미 선택된 색상이 있으면 라벨 설정
    const selectedOption = colorOptions.find(
      (option) => option.color === event.backgroundColor
    );
    if (selectedOption) {
      setSelectedLabel(selectedOption.label);
    } else {
      setSelectedLabel("색상을 선택하세요");
    }
  }, [event.backgroundColor]);

  // ISO 8601 형식의 시간을 "오전/오후" 형식으로 변환하는 함수
  const formatTimeForSelect = (isoString) => {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "오후" : "오전";

    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return `${period} ${hours}:${minutes}`;
  };

  // 시간 선택 핸들러에서 시간 값 업데이트
  const handleStartTimeChange = (time) => {
    if (isAllDay) return; // 종일 이벤트일 경우 시간 변경 무시

    const [period, hourMinute] = time.split(" ");
    let [hour, minute] = hourMinute.split(":").map(Number);

    // "오후"일 때 시간 계산
    if (period === "오후" && hour < 12) {
      hour += 12;
    } else if (period === "오전" && hour === 12) {
      hour = 0;
    }

    const newStartDate = new Date(startDate);
    newStartDate.setHours(hour, minute);

    // ISO로 변환하지 않고 Date 객체로 저장
    setStartDate(newStartDate);
  };

  // 종료 시간 처리도 동일하게 적용
  const handleEndTimeChange = (time) => {
    if (!time) {
      console.error("Invalid time value:", time); // time 값이 없을 경우 디버그 로그 출력
      return;
    }

    const [period, hourMinute] = time.split(" ");
    let [hour, minute] = hourMinute.split(":").map(Number);

    if (period === "오후" && hour < 12) {
      hour += 12;
    } else if (period === "오전" && hour === 12) {
      hour = 0;
    }

    const newEndDate = new Date(endDate);
    newEndDate.setHours(hour, minute);

    // ISO로 변환하지 않고 Date 객체로 저장
    setEndDate(newEndDate);
    console.log("확인용2", newEndDate);
  };

  // 종일 이벤트 토글
  const toggleAllDay = () => {
    setIsAllDay((prev) => !prev);
    if (!isAllDay) {
      // 종일 이벤트가 선택되면 시간을 제거하고, 시간을 자정으로 설정
      const newStartDate = new Date(startDate);
      newStartDate.setHours(0, 0, 0, 0);
      setStartDate(newStartDate);

      const newEndDate = new Date(endDate);
      newEndDate.setHours(23, 59, 59, 999);
      setEndDate(newEndDate);
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.modal}>
      <div className={styles["modal-content"]}>
        {/* 제목 */}
        <div className={styles.titleContainer}>
          <input
            className={styles.title}
            value={title || ""}
            placeholder="제목"
            onChange={handleTitleChange}
          ></input>

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
              selected={new Date(startDate)}
              onChange={(date) => setStartDate(date.toISOString())}
              dateFormat="yyyy년 MM월 dd일"
              className={styles.dateInput}
            />
            {/* 시작 시간 */}
            {!isAllDay && (
              <select
                value={formatTimeForSelect(startDate)} // 시작 시간 값
                onChange={(e) => handleStartTimeChange(e.target.value)}
                className={styles.timeInput}
              >
                {timeOptions.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            )}
            {/* 중간 구분 기호 */}
            <span> - </span>
            {/* 종료 시간 */}
            {!isAllDay && (
              <select
                value={formatTimeForSelect(endDate)}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                className={styles.timeInput}
              >
                {timeOptions.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            )}
            {/* 종료 날짜 */}
            <DatePicker
              selected={new Date(endDate)}
              onChange={(date) => setEndDate(date.toISOString())}
              dateFormat="yyyy년 MM월 dd일"
              className={styles.dateInput}
            />
          </div>
        </div>
        {/* 날짜 및 시간 */}
        <div className={styles.dateTimeSection}>
          <BsClock
            className={styles.icon}
            style={{ color: "#fff" }} // 선택된 색상이 없으면 기본값
          />
          <div className={styles.dateTimeContainer}>
            {/* 종일 이벤트 체크박스 */}
            <label>
              <input
                type="checkbox"
                checked={isAllDay}
                onChange={toggleAllDay}
                toggle={selectedColor}
              />
              종일 이벤트
            </label>
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
            value={selectedOption} // 선택된 값 전달
            onChange={handleColorChange} // 선택된 값을 넘김
            placeholder={
              selectedColor
                ? colorOptions.find((option) => option.color === selectedColor)
                    ?.label || "색상을 선택하세요"
                : "색상을 선택하세요"
            }
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

              <BsAlarm
                className={styles.icon}
                style={{ color: selectedColor }}
              />
              <div className={styles.contentField}>
                <span style={{ width: "100%" }} onClick={toggleAlarmSetting}>
                  {alarmText}
                </span>
                {/* 클릭 시 알림 설정 UI */}
                {showAlarmSetting && (
                  <div
                    style={{
                      position: "absolute", // 절대 위치 설정
                      zIndex: 1000, // 다른 요소 위로 배치
                      backgroundColor: "#f9f9f9",
                      border: "1px solid #e0e0e0",
                      borderRadius: "5px",
                      padding: "8px",
                      marginTop: "25px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 그림자 추가
                      width: "100%", // 필드 너비에 맞추기
                    }}
                  >
                    <AlarmSetting
                      onAlarmChange={handleAlarmChange}
                      color={selectedColor}
                    />
                  </div>
                )}
              </div>
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
            onClick={handleSaveClick} // 저장 시 선택된 색상 전달
            style={{ backgroundColor: selectedColor }} // 선택된 색상이 없으면 기본값
          >
            저장
          </button>
        </div>
      </div>
    </div>,
    document.body // 모달을 body에 추가
  );
};

export default EventModal;
