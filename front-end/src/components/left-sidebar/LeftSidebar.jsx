import React from "react";
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

const LeftSidebar = () => {
  const nav = useNavigate();
  const isOpen = useSelector((state) => state.leftSidebar.isOpen);

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

const handleLogout = async () => {
  try {
    // 서버에 로그아웃 요청
    await axios.post('http://localhost:8089/wefam/logout');

    // 모든 쿠키 삭제
    deleteAllCookies();

    // 로컬 스토리지와 세션 스토리지 삭제
    window.localStorage.clear();
    window.sessionStorage.clear();

    // 로그인 페이지로 리다이렉트
    nav("/");
  } catch (error) {
    console.error("로그아웃 중 에러 발생:", error);
  }
};

  return (
    <div className={`${styles.leftSidebar} ${isOpen ? "" : styles.closed}`}>
      {/* 프로필 */}
      <div className={styles.profile}>
        <img
          className={styles.profileThumbnail}
          src={profileThumbnail}
          alt="프로필"
        ></img>
        <div className={styles.profileName}>구찌캣</div>
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
                nav("/main/housework");
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
