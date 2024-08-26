import React, { useState } from "react";
import { BsAlarm } from "react-icons/bs"; // 알림 아이콘

const AlarmSetting = () => {
  const [alarmTime, setAlarmTime] = useState(10); // 알림 시간
  const [alarmUnit, setAlarmUnit] = useState("분 전"); // 알림 단위
  const [alarms, setAlarms] = useState([]); // 추가된 알림 리스트

  const unitOptions = [
    { label: "분 전", value: "분 전" },
    { label: "시간 전", value: "시간 전" },
    { label: "일 전", value: "일 전" },
    { label: "주 전", value: "주 전" },
  ];

  // 알림 추가 함수
  const handleAddAlarm = () => {
    const newAlarm = `${alarmTime} ${alarmUnit}`;
    setAlarms([...alarms, newAlarm]); // 새로운 알림 추가
  };

  return (
    <div style={{ padding: "5px" }}>
      {/* 알림 입력 부분 */}
      <div
        style={{
          display: "absolute",
          alignItems: "center",
        }}>
        <span>일정 알림:</span>
        {/* 알림 시간 숫자 입력 */}
        <input
          type='number'
          value={alarmTime}
          onChange={(e) => setAlarmTime(e.target.value)}
          min={1}
          style={{
            backgroundColor: "#ccc",
            width: "100px",
            padding: "5px",
            borderRadius: "5px",
            border: "none",
            textAlign: "center",
          }}
        />
        {/* 알림 단위 선택 드롭다운 */}
        <select
          value={alarmUnit}
          onChange={(e) => setAlarmUnit(e.target.value)}
          style={{
            backgroundColor: "#ccc",
            width: "100px",
            padding: "5px",
            borderRadius: "5px",
            border: "none",
            boxShadow: 0.1,
            textAlign: "center",
          }}>
          {unitOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 알림 추가 버튼 */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={handleAddAlarm}
          style={{
            color: "#007bff",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}>
          알림을 추가
        </button>
      </div>

      {/* 추가된 알림 목록 표시 */}
      {alarms.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>추가된 알림:</h4>
          <ul>
            {alarms.map((alarm, index) => (
              <li key={index}>{alarm}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AlarmSetting;
