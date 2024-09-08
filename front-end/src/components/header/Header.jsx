import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toggleLeftSidebar } from "../../features/leftSidebarSlice";
import styles from "./Header.module.css";
import { HiMiniBars3 } from "react-icons/hi2";
import logo from "../../assets/images/logo-text-segoe.png";
import { GoBell } from "react-icons/go";
import { HiOutlineTrophy } from "react-icons/hi2";
import AlarmModal from "./AlarmModal";
import { NotificationContext } from "../../NotificationContext";

const Header = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [familyMotto, setFamilyMotto] = useState("");
  const groupName = "우리가족"; //임시 그룹명
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [userImages, setUserImages] = useState([]);
  const [groups, setGroups] = useState([]); // 그룹 목록 상태
  const [isAddCircleOpen, setIsAddCircleOpen] = useState(false);
  const [isAlarm, setIsAlarm] = useState(false);
  const alarmRef = useRef(null); // 알람 모달 감지용 ref
  const bellRef = useRef(null); // bell 아이콘 감지용 ref
  const { notifications } = React.useContext(NotificationContext);

  const handleMenuClick = () => {
    dispatch(toggleLeftSidebar());
  };

  // Redux에서 사용자 정보 가져오기
  const userData = useSelector((state) => state.user.userData);

  // 본인 계정과 일치하는 알림 개수 필터링
  const filteredNotifications = userData
    ? notifications.filter(
        (notification) => notification.receiverId === userData.id
      )
    : [];

  useEffect(() => {
    if (userData) {
      // 첫 번째 GET 요청: 가족 데이터를 가져옴
      axios
        .get("http://localhost:8089/wefam/get-family")
        .then((response) => {
          const loadedImages = response.data.map((user) => user.profileImg);
          setUserImages(loadedImages);
        })
        .catch((error) => {
          console.error("가져오기 에러!!", error);
        });
      // 두 번째 GET 요청: 가족 가훈을 가져옴
      axios
        .get(`http://localhost:8089/wefam/get-family-nick/${userData.id}`)
        .then((response) => {
          setFamilyMotto(response.data);
        })
        .catch((error) => {
          console.error("가훈 가져오기 에러:", error);
        });
    }
  }, [userData]); // userData가 변경될 때마다 실행

  const handleMottoChange = (e) => {
    setFamilyMotto(e.target.value);
  };

  const updateFamilyMotto = () => {
    if (!familyMotto) {
      alert("가훈을 입력하세요.");
      return;
    }
    const updatedFamily = {
      familyIdx: 1,
      familyMotto: familyMotto,
      userId: userData.id,
    };

    axios
      .put("http://localhost:8089/wefam/update-family-motto", updatedFamily)
      .then((response) => {
        console.log("가훈 업데이트 성공:");
      })
      .catch((error) => {
        console.error("가훈 업데이트 실패:", error);
      });
  };

  const handleBellClick = () => {
    alert("알람~");
  };

  const handleTrophyClick = () => {
    nav("/main/reward");
  };

  const handleProfileClick = () => {
    alert("프로필 클릭");
  };

  return (
    <div>
      <div style={{ width: "100%" }}>
        <nav>
          <div className={styles.menuBtnContainer}>
            <button className={styles.menuBtn}>
              {/* 왼쪽 미니바 */}
              <HiMiniBars3
                className={styles.menuIcon}
                onClick={handleMenuClick}
              />
            </button>
          </div>
          <div
            className={styles.logoContainer}
            onClick={() => {
              nav("/main");
            }}
            style={{ cursor: "pointer" }}
          >
            {/* WeFAM로고 */}
            <img className={styles.logo} src={logo}></img>
          </div>
          <div className={styles.groupContainer}>{familyMotto}</div>
          <div className={styles.infoContainer}>
            <div className={styles.infoField}>
              <div
                className={styles.icon}
                onClick={handleBellClick}
                ref={bellRef}
              >
                <GoBell />
                {filteredNotifications.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-3px",
                      background: "var(--color-sunset)",
                      color: "white",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {filteredNotifications.length}
                  </div>
                )}
              </div>
              {isAlarm && (
                <div ref={alarmRef} style={{ position: "absolute" }}>
                  <AlarmModal />
                </div>
              )}
              <div className={styles.icon} onClick={handleTrophyClick}>
                <HiOutlineTrophy />
              </div>
              <div
                className={styles.profileImageWrapper}
                onClick={handleProfileClick}
              >
                <img
                  src={userData.profileImg}
                  className={styles.profileImage}
                  alt="사용자 프로필"
                />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
