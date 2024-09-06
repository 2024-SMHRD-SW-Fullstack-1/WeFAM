import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import style from "./Header.module.css"; // CSS 모듈을 사용하여 스타일을 정의합니다.
import notificationIcon2 from "../../assets/images/dot.png"; // 임의의 알림 아이콘 이미지 경로
import notificationIcon3 from "../../assets/images/dot.png"; // 임의의 알림 아이콘 이미지 경로
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
const AlarmModal = () => {
  // 임의의 알림 데이터를 설정합니다.
  const userData = useSelector((state) => state.user.userData);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      date: "2024-09-06",
      summary: "새로운 메시지가 도착했습니다!",
      description: "친구로부터 새로운 메시지를 받았습니다.",
      type: "메시지",
      link: "/messages",
    },
    {
      id: 2,
      date: "2024-09-05",
      summary: "이벤트 초대가 도착했습니다!",
      description: "가족 이벤트에 초대되었습니다.",
      type: "이벤트",
      link: "/events",
    },
    {
      id: 3,
      date: "2024-09-04",
      summary: "새로운 알림이 있습니다!",
      description: "오늘의 할 일이 있습니다.",
      type: "알림",
      link: "/tasks",
    },
  ]);

  // 알림 로딩 상태와 에러 상태를 임의로 설정합니다.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return ReactDOM.createPortal(
    <div
      style={{
        backgroundColor: "#ffffff",
        marginTop: "2rem",
        borderRadius: "1rem",
        padding: "1rem",
        position: "absolute",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "300px",
        zIndex: 2000,
        right: 0,
        top: 30,
        backgroundColor: "#fff",
      }}>
      {/* <div className={style.header}></div> */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        notifications
          .filter((notification) => notification) // 알림이 있는지 필터링
          .map((notification) => (
            <Link
              to={notification?.link || "/"}
              key={notification.id}
              className={style.notificationLink}
              style={{ textDecoration: "none", color: "black" }}>
              <div
                style={{
                  borderBottom: "1px solid #e0e0e0",
                  padding: "0.5rem 0",
                }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={notificationIcon3}
                    className={style.notificationIcon3}
                    alt='Notification Icon'
                    style={{ width: "30px", marginRight: "10px" }}
                  />
                  <span style={{ fontWeight: "bold" }}>
                    {notification.summary}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#757575" }}>
                  {notification.date}
                </p>
                <p className={style.notificationDescription}>
                  {notification.description}
                </p>
                <p
                  className={style.notificationType}
                  style={{ fontSize: "12px", color: "#757575" }}>
                  {notification.type}
                </p>
              </div>
            </Link>
          ))
      )}
    </div>,
    document.body
  );
};

export default AlarmModal;
