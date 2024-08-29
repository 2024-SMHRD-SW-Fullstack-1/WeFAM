import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import WeFAM from "../../assets/images/WeFAM_logo.png";
import Kakao from "../../assets/images/Kakao.png";
import Naver from "../../assets/images/naver.png";
import axios from "axios";
import RightSidebar from "../right-sidebar/RightSidebar";
import { useDispatch } from "react-redux";
import { setUserData } from "../../features/userSlice";
import { setFamilyData } from "../../features/familySlice";

// 카카오 로그인
const REST_API_KEY = "e8bed681390865b7c0ef4d85e4e2c842";
const REDIRECT_URI = "http://localhost:3000/login";
const kakaoToken = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

// 네이버 로그인
const NAVER_CLIENT_ID = "Ww06wMPg4Td98siNlRth";
const NAVER_CALLBACK_URL = "http://localhost:3000";
const naverToken = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_CALLBACK_URL}`;

const LogIn = () => {
  const [code, setCode] = useState(null);
  // const [userData, setUserData] = useState(null); // 사용자 데이터를 저장할 상태 추가
  const nav = useNavigate();
  const dispatch = useDispatch();

  //카카오로그인 핸들러
  const KakaoLogin = () => {
    console.log("카카오 로그인 버튼 클릭됨");
    window.location.href = kakaoToken;
  };

  // 네이버 로그인 핸들러
  const NaverLogin = () => {
    console.log("네이버 로그인 버튼 클릭됨");
    window.location.href = naverToken;
  };

  useEffect(() => {
    // 토큰값 추출
    const url = window.location.href;
    const code = new URL(url).searchParams.get("code");
    console.log("백으로 보내줄거 : ", code);
    setCode(code);
    sendKakaoTokenToBackend(code);
  }, []);

  const sendKakaoTokenToBackend = async (code) => {
    try {
      const response = await axios.post(
        "http://localhost:8089/wefam/login",
        code,
        {
          headers: {
            "Content-Type": "text/plain", // 단순 문자열로 전달
          },
        }
      );

      if (response.status === 200) {
        const userData = response.data;
        console.log("카카오 사용자 정보: ", userData);
        dispatch(setUserData(userData)); // Redux에 사용자 데이터 저장

        nav("/", { state: { userData } });
      } else {
        console.log("카카오 백 요청 실패", response.statusText);
      }
    } catch (error) {
      console.log(
        "카카오 백 요청 중 오류:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const sendNaverTokenToBackend = async (code) => {
    console.log("네이버 토큰 백엔드로 전송 시작");
    try {
      const response = await axios.post("http://localhost:8089/wefam/login", {
        code,
      });

      if (response.status === 200) {
        const data = response.data;
        console.log("네이버 사용자 정보 : ", data);
        setTimeout(() => {
          nav("/");
        }, 2000); // 리디렉트 2초 지연
      } else {
        console.log("네이버 백 요청 실패", response.statusText);
      }
    } catch (error) {
      console.log("네이버 백 요청 중 오류", error);
    }
  };

  return (
    <div className={styles.LoginPage}>
      <div>
        <img src={WeFAM} className={styles.WeFAM_Logo} alt="WeFAM Logo" />
        <h2 className={styles.subtitle}>우리 가족만을 위한 특별한 공간</h2>

        <div className={styles.buttonContainer}>
          <div className={styles.kakao_loginButton}>
            <img src={Kakao} className={styles.icon} alt="Kakao Icon" />
            <button className={styles.KakaoLogin} onClick={KakaoLogin}>
              Kakao로 시작하기
            </button>
          </div>

          <div className={styles.naver_loginButton}>
            <img src={Naver} className={styles.icon} alt="Naver Icon" />
            <button className={styles.NaverLogin} onClick={NaverLogin}>
              Naver로 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
