// 타임트리 젤 위의 헤더 부분입니다.
import React from "react";
import styles from "../css/Header.module.css";
import { HiMiniBars3 } from "react-icons/hi2";

const Header = () => {
  return (
    <div>
      <nav>
        <div className={styles.groupListContainer}>
          <button className={styles.groupListBtn}>
            <HiMiniBars3 className={styles.groupListIcon} />
          </button>
        </div>

        <div className={styles.logoContainer}>
          <a href="/" className={styles.logoLink}>
            <img
              className={styles.logo}
              src={`${process.env.PUBLIC_URL}/images/logo.png`}
            ></img>
          </a>
        </div>

        <div className={styles.navController}>
          <div className={styles.timeController}>
            <button>오늘</button>
            <button>왼쪽</button>
            <button>오른쪽</button>
            <time dateTime="2024-08">2024년 8월</time>
          </div>
          <div className={styles.viewModeController}>
            <button>연간</button>
            <button>월간</button>
            <button>주간</button>
          </div>
          <div className={styles.searchController}>
            <input
              name="search"
              type="text"
              placeholder="검색어를 입력하세요."
            ></input>
            <button>검색</button>
            <button>추가</button>
          </div>
        </div>

        <div className={styles.profileContainer}>
          <button className={styles.profileButton}>
            <img
              className={styles.profileImage}
              src={`${process.env.PUBLIC_URL}/images/gucci-cat.png`}
            />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Header;
