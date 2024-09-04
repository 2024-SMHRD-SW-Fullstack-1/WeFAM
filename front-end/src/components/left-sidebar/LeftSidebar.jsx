import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./LeftSidebar.module.css";

import profileThumbnail from "../../assets/images/gucci-cat.png";

import { CiHome } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { CiStickyNote } from "react-icons/ci";
import { CiCircleList } from "react-icons/ci";
import { CiForkAndKnife } from "react-icons/ci";
import { CiImageOn } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import axios from "axios";

// 카카오 로그인
const REST_API_KEY = "e8bed681390865b7c0ef4d85e4e2c842";
const REDIRECT_URI = "http://localhost:3000";
const kakaoToken = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

const LeftSidebar = () => {
  const [familyNick, setFamilyNick] = useState("");
  const userData = useSelector((state) => state.user.userData);
  const nav = useNavigate();
  const isOpen = useSelector((state) => state.leftSidebar.isOpen);


  useEffect(() => {
    if (userData) {
      axios.get(`http://localhost:8089/wefam/get-family-nick/${userData.id}`)
        .then(response => {
          setFamilyNick(response.data);
        })
        .catch(error => {
          console.error("가족 이름을 가져오는 중 에러 발생:", error);
        });
    }
  }, [userData]);

  

// 로그아웃 처리 함수
const handleLogout = async () => {
  // 1. 로컬 스토리지와 세션 스토리지에서 카카오 토큰 삭제
  window.localStorage.removeItem(kakaoToken); // 로컬 스토리지에 저장된 카카오 토큰 삭제
  window.sessionStorage.removeItem(kakaoToken); // 세션 스토리지에 저장된 토큰 삭제
  
  // 2. 모든 쿠키 삭제 (필요한 경우)
  deleteAllCookies();
  
  // 3. 백엔드에 세션 무효화 요청
  try {
    await axios.post('http://localhost:8089/wefam/logout'); // 세션 무효화 요청
  } catch (error) {
    console.error("로그아웃 요청 중 에러 발생:", error);
  }

  // 4. 로그인 페이지로 리디렉트
  nav("/");
  console.log("이거 되는거맞냐?????",kakaoToken);
};

// 쿠키 삭제 함수
const deleteAllCookies = () => {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

  return (
    <div className={`${styles.leftSidebar} ${isOpen ? "" : styles.closed}`}>
      {/* 프로필 */}
      <div className={styles.profile}>
        <img
          className={styles.profileThumbnail}
          src={userData.profileImg}
          alt="프로필"
        ></img>
        <div className={styles.profileName}>{familyNick}</div>
      </div>

      {/* 카테고리 */}
      <div className={styles.category}>
        {/* 메뉴 */}
        <ul className={styles.menu}>
          <li>
            <span
              onClick={() => {
                nav("/main");
              }}
              style={{ cursor: "pointer" }}
            >
              <CiHome className={styles.categoryItemLogo} />
              <span>홈</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                nav("/main/calendar");
              }}
              style={{ cursor: "pointer" }}
            >
              <CiCalendar className={styles.categoryItemLogo} />
              <span>달력</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                nav("/main/housework2");
              }}
              style={{ cursor: "pointer" }}
            >
              <CiCircleList className={styles.categoryItemLogo} />
              <span>집안일</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                nav("/main/recipe");
              }}
              style={{ cursor: "pointer" }}
            >
              <CiForkAndKnife className={styles.categoryItemLogo} />
              <span>요리사</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                nav("/main/album");
              }}
              style={{ cursor: "pointer" }}
            >
              <CiImageOn className={styles.categoryItemLogo} />
              <span>가족 앨범</span>
            </span>
          </li>
        </ul>

        {/* 가족 정보 */}
        <ul className={styles.set}>
          <li>
            <span
              onClick={() => {
                nav("/main/settings");
              }}
            >
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
