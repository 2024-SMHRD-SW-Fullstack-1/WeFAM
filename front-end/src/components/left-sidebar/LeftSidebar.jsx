import React from "react";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className={styles.leftSidebar}>
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
                nav("/");
              }}
            >
              <CiHome className={styles.categoryItemLogo} />
              <span>홈</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                nav("/calendar");
              }}
            >
              <CiCalendar className={styles.categoryItemLogo} />
              <span>달력</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                nav("/memo");
              }}
            >
              <CiStickyNote className={styles.categoryItemLogo} />
              <span>메모</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                nav("/todo");
              }}
            >
              <CiCircleList className={styles.categoryItemLogo} />
              <span>할일</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                nav("/recipe");
              }}
            >
              <CiForkAndKnife className={styles.categoryItemLogo} />
              <span>요리법</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                nav("/gallery");
              }}
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
                nav("/settins");
              }}
            >
              <CiSettings className={styles.categoryItemLogo} />
              <span>설정</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                nav("/login");
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
