import React from "react";
import styles from "../css/LeftSidebar.module.css";

import profileBackground from "../assets/images/profile-background-image.png";
import profileThumbnail from "../assets/images/gucci-cat.png";

import { CiHome } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { CiStickyNote } from "react-icons/ci";
import { CiCircleList } from "react-icons/ci";
import { CiForkAndKnife } from "react-icons/ci";
import { CiImageOn } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";

const LeftSidebar = () => {
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
            <a href="/">
              <span>
                <CiHome className={styles.categoryItemLogo} />홈
              </span>
            </a>
          </li>
          <li>
            <a href="">
              <span>
                <CiCalendar className={styles.categoryItemLogo} />
                달력
              </span>
            </a>
          </li>
          <li>
            <a href="/">
              <span>
                <CiStickyNote className={styles.categoryItemLogo} />
                메모
              </span>
            </a>
          </li>
          <li>
            <a href="/">
              <span>
                <CiCircleList className={styles.categoryItemLogo} />
                할일
              </span>
            </a>
          </li>
          <li>
            <a href="/">
              <span>
                <CiForkAndKnife className={styles.categoryItemLogo} />
                요리법
              </span>
            </a>
          </li>
          <li>
            <a href="/">
              <span>
                <CiImageOn className={styles.categoryItemLogo} />
                사진첩
              </span>
            </a>
          </li>
        </ul>

        {/* 세팅 */}
        <ul className={styles.set}>
          <li>
            <a href="/">
              <span>
                <CiSettings className={styles.categoryItemLogo} />
                설정
              </span>
            </a>
          </li>
          <li>
            <a href="/">
              <span>
                <CiLogout className={styles.categoryItemLogo} />
                로그아웃
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;
