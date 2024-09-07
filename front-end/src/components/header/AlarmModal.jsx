import React, { useContext } from "react";
import { NotificationContext } from "../../NotificationContext";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import style from "./Header.module.css";
import { elapsedTime } from "../../elapsedTime";

const AlarmModal = () => {
  const { notifications } = useContext(NotificationContext);

  // 답장 버튼 클릭 시 호출되는 핸들러
  const handleReply = (senderNick) => {
    alert(`답장하기: ${senderNick}`); // 실제 구현 시 답장 폼을 열거나 다른 동작 수행
  };

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
      }}
    >
      {notifications.length === 0 ? (
        <p>새로운 메시지가 없습니다.</p>
      ) : (
        notifications.map((notification) => (
          <Link
            to={notification?.link || "/"}
            key={notification.id}
            className={style.notificationLink}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div
              style={{
                borderBottom: "1px solid #e0e0e0",
                padding: "0.5rem 0",
              }}
              onClick={() => handleReply(notification.senderNick)}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={notification.profileImg}
                  className={style.notificationIcon3}
                  alt="Profile Image"
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "10px",
                    borderRadius: "50%",
                  }}
                />
                <span style={{ fontWeight: "bold" }}>
                  {notification.senderNick || "알림 제목"}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    display: "flex-end",
                    alignItems: "center",
                    fontSize: "20px", // 필요에 따라 크기 조정
                  }}
                >
                  &times;
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "#757575" }}>
                {elapsedTime(notification.time)} {/* 시간 차이 출력 */}
              </p>
              <p className={style.notificationDescription}>
                {notification.message || "메시지 내용 없음"}
              </p>
              <p
                className={style.notificationType}
                style={{ fontSize: "12px", color: "#757575" }}
              >
                {notification.type || "알림 유형 없음"}
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
