import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./LeftSidebar.module.css";

import profileThumbnail from "../../assets/images/gucci-cat.png";
import familyPT from "../../assets/images/famaily.png";

import { CiHome } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { CiStickyNote } from "react-icons/ci";
import { CiCircleList } from "react-icons/ci";
import { CiForkAndKnife } from "react-icons/ci";
import { CiImageOn } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import axios from "axios";

const LeftSidebar = () => {
  const [familyMotto, setFamilyMotto] = useState("");
  const [profileImage, setProfileImage] = useState(familyPT); // 기본 이미지로 초기화
  const userData = useSelector((state) => state.user.userData);
  const nav = useNavigate();
  const isOpen = useSelector((state) => state.leftSidebar.isOpen);

  useEffect(() => {
    if (userData) {
      // 가족 이름 및 프로필 이미지 불러오기
      fetchFamilyMotto();
      fetchProfileImage();
    }
  }, [userData]);

  // familyMotto를 불러오는 함수
  const fetchFamilyMotto = () => {
    axios
      .get(`http://localhost:8089/wefam/get-family-motto/${userData.id}`)
      .then((response) => {
        setFamilyMotto(response.data); // 가족 이름 상태 설정
      })
      .catch((error) => {
        console.error("가족 이름을 가져오는 중 에러 발생:", error);
      });
  };

  // 프로필 이미지를 불러오는 함수
  const fetchProfileImage = () => {
    const url = `http://localhost:8089/wefam/get-album-images/${userData.familyIdx}?entityType=family`;

    axios
      .get(url)
      .then((response) => {
        if (response.data.length === 0) {
          setProfileImage(familyPT); // 이미지가 없을 때 기본 이미지 사용
        } else {
            const familyImages = response.data.filter(image => image.entityType === "family");
          const latestFamilyImage = familyImages[familyImages.length - 1];
          setProfileImage(`data:image/${latestFamilyImage.fileExtension};base64,${latestFamilyImage.fileData}`);
        }
      })
      .catch((error) => {
        console.error("이미지를 불러오는 중 오류 발생:", error);
      });
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    const accessToken = window.localStorage.getItem("kakaoAccessToken");
    window.localStorage.removeItem("kakaoAccessToken");

    try {
      const response = await axios.post("http://localhost:8089/wefam/logout", {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 200) {
        window.localStorage.removeItem("kakaoAccessToken");
      } else {
        console.error("로그아웃 실패");
      }
    } catch (error) {
      nav("/");
      console.error("로그아웃 요청 중 에러 발생:", error);
    }
  };

  return (
    <div className={`${styles.leftSidebar} ${isOpen ? "" : styles.closed}`}>
      {/* 프로필 */}
      <div className={styles.profile} style={{ backgroundImage: `url(${profileImage})` }}>
        <div className={styles.profileName}><p>{familyMotto}</p></div>
      </div>

      {/* 카테고리 */}
      <div className={styles.category}>
        {/* 메뉴 */}
        <ul className={styles.menu}>
          <li>
            <span onClick={() => nav("/main")} style={{ cursor: "pointer" }}>
              <CiHome className={styles.categoryItemLogo} />
              <span>홈</span>
            </span>
          </li>
          <li>
            <span onClick={() => nav("/main/calendar")} style={{ cursor: "pointer" }}>
              <CiCalendar className={styles.categoryItemLogo} />
              <span>달력</span>
            </span>
          </li>
          <li>
            <span onClick={() => nav("/main/housework2")} style={{ cursor: "pointer" }}>
              <CiCircleList className={styles.categoryItemLogo} />
              <span>집안일</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                nav("/main/meal");
              }}
              style={{ cursor: "pointer" }}
            >
              <CiForkAndKnife className={styles.categoryItemLogo} />
              <span>요리법</span>
            </span>
          </li>
          <li>
            <span onClick={() => nav("/main/album")} style={{ cursor: "pointer" }}>
              <CiImageOn className={styles.categoryItemLogo} />
              <span>가족 앨범</span>
            </span>
          </li>
        </ul>

        {/* 가족 정보 */}
        <ul className={styles.set}>
          <li>
            <span onClick={() => nav("/main/settings")}>
              <CiSettings className={styles.categoryItemLogo} />
              <span>가족정보</span>
            </span>
          </li>
          <li>
            <span onClick={handleLogout}>
              <CiLogout className={styles.categoryItemLogo} />
              <span>로그아웃</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;
