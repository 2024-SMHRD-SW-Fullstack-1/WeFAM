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

const LeftSidebar = () => {
  const nav = useNavigate();
  const isOpen = useSelector((state) => state.leftSidebar.isOpen);

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
              <span>요리법</span>
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
              <span>사진첩</span>
            </span>
          </li>
        </ul>

        {/* 세팅 */}
        <ul className={styles.set}>
          <li>
            <span
              onClick={() => {
                nav("/settings");
              }}
            >
              <CiSettings className={styles.categoryItemLogo} />
              <span>설정</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                nav("/");
              }}
            >
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
