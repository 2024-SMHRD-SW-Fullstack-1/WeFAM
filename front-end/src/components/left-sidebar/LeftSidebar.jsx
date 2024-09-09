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
import iconMenuAlbum from "../../assets/images/icon-menu-album.png";
import iconMenuMeal from "../../assets/images/icon-menu-meal.png";
import iconMenuHousework from "../../assets/images/icon-menu-housework.png";
import iconMenuFamily from "../../assets/images/icon-menu-family.png";
import iconMenuLogout from "../../assets/images/icon-menu-logout.png";
import axios from "axios";

// 카카오 로그인
const REST_API_KEY = "e8bed681390865b7c0ef4d85e4e2c842";
const REDIRECT_URI = "http://localhost:3000";
const kakaoToken = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

const LeftSidebar = () => {
  const [familyMotto, setFamilyMotto] = useState("");
  const [profileImage, setProfileImage] = useState(null); // 가족 프로필 이미지 상태
  const userData = useSelector((state) => state.user.userData);
  const nav = useNavigate();
  const isOpen = useSelector((state) => state.leftSidebar.isOpen);

  const accessToken1 = userData.accessToken;

  useEffect(() => {
    if (userData) {
      axios
        .get(`http://localhost:8089/wefam/get-family-motto/${userData.id}`)
        .then((response) => {
          setFamilyMotto(response.data);
        })
        .catch((error) => {
          console.error("가족 이름을 가져오는 중 에러 발생:", error);
        });

      // 프로필 이미지 불러오기 (미사용)
      fetchProfileImage();
    }
  }, [userData]);

  // 프로필 이미지 불러오는 함수 추가 (미사용)
  const fetchProfileImage = () => {
    const url = `http://localhost:8089/wefam/get-album-images/${userData.familyIdx}?entityType=family`;

    axios
      .get(url)
      .then((response) => {
        if (response.data.length === 0) {
          setProfileImage(null); // 불러올 이미지가 없을 때 기본 이미지 사용
        } else {
          // entityType이 family인 이미지 중 가장 최신 이미지 사용
          const familyImages = response.data.filter(
            (image) => image.entityType === "family"
          );
          const latestFamilyImage = familyImages[familyImages.length - 1]; // 최신 이미지 선택
          setProfileImage(
            `data:image/${latestFamilyImage.fileExtension};base64,${latestFamilyImage.fileData}`
          );
        }
      })
      .catch((error) => {
        console.error("이미지를 불러오는 중 오류 발생:", error);
      });
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    const accessToken = window.localStorage.getItem("kakaoAccessToken");

    // 1. 로컬 스토리지에서 토큰 삭제
    window.localStorage.removeItem("kakaoAccessToken");

    // 2. 백엔드에 로그아웃 요청, 카카오 로그아웃 API 호출
    console.log("된거아님?");
    try {
      const response = await axios.post(
        "http://localhost:8089/wefam/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("로그아웃 성공");
        window.localStorage.removeItem("kakaoAccessToken");
        nav("/");
      } else {
        console.error("로그아웃 실패");
      }
    } catch (error) {
      console.error("로그아웃 요청 중 에러 발생:", error);
    }

    // 3. 로그인 페이지로 리디렉트
    nav("/");
    console.log("토큰값?", userData.accessToken);

    console.log("카카오 토큰 삭제 및 로그아웃 처리 완료");
  };

  return (
    <div className={`${styles.leftSidebar} ${isOpen ? "" : styles.closed}`}>
      {/* 프로필 */}
      <div
        className={styles.profile}
        style={{ backgroundImage: `url(${profileImage})` }} // 동적으로 불러온 이미지 적용
      >
        {/* 미사용 */}
        {/* <img
          className={styles.profileThumbnail}
          src={userData.profileImg || profileThumbnail}
          alt="프로필"
        /> */}
      </div>
      <div className={styles.familyMotto}>
        <p>{familyMotto}</p>
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
              {/* <CiHome className={styles.categoryItemLogo} /> */}
              <i
                className="xz74otr"
                style={{
                  backgroundImage:
                    'url("https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/eECk3ceTaHJ.png")',
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  width: "36px",
                  height: "36px",
                  display: "inline-block",
                }}
                aria-hidden="true"
              ></i>
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
              <i
                data-visualcompletion="css-img"
                style={{
                  backgroundImage:
                    'url("https://static.xx.fbcdn.net/rsrc.php/v3/yV/r/vTDQ3deAsEh.png")',
                  backgroundPosition: "0px -37px",
                  backgroundSize: "auto",
                  width: "36px",
                  height: "36px",
                  backgroundRepeat: "no-repeat",
                  display: "inline-block",
                }}
              ></i>
              {/* <CiCalendar className={styles.categoryItemLogo} /> */}
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
              <img
                src={iconMenuHousework}
                alt=""
                style={{
                  width: "36px",
                  height: "36px",
                  display: "inline-block",
                  padding: "2px",
                }}
              />
              {/* <CiCircleList className={styles.itemLogo} /> */}
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
              <img
                src={iconMenuMeal}
                alt=""
                style={{
                  width: "36px",
                  height: "36px",
                  display: "inline-block",
                }}
              />
              {/* <CiForkAndKnife className={styles.itemLogo} /> */}
              <span>가족 식사</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                nav("/main/album");
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src={iconMenuAlbum}
                alt=""
                style={{
                  width: "36px",
                  height: "36px",
                  display: "inline-block",
                }}
              />
              {/* <CiImageOn className={styles.itemLogo} /> */}
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
              <img
                src={iconMenuFamily}
                alt=""
                style={{
                  width: "36px",
                  height: "36px",
                  display: "inline-block",
                  padding: "2px",
                }}
              />
              {/* <CiSettings className={styles.itemLogo} /> */}
              <span>가족정보</span>
            </span>
          </li>
          <li>
            <span onClick={handleLogout}>
              <img
                src={iconMenuLogout}
                alt=""
                style={{
                  width: "36px",
                  height: "36px",
                  display: "inline-block",
                  padding: "2px",
                }}
              />
              {/* <CiLogout className={styles.itemLogo} /> */}
              <span>로그아웃</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;
