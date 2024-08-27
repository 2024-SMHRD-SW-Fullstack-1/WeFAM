import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import WeFAM from "../../assets/images/WeFAM_logo.png.png";
import Kakao from "../../assets/images/Kakao.png";
import Naver from "../../assets/images/naver.png";
import Google from "../../assets/images/google.png";

const LogIn = () => {
  const nav = useNavigate();

  useEffect(() => {
    // 로그아웃 처리 로직

    nav("/login");
  }, [nav]);

  //카카오 로그인
  const REST_API_KEY = "e8bed681390865b7c0ef4d85e4e2c842";
  const REDIRECT_URI = "http://localhost:3000/login";
  const kakaoToken = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

  useEffect(() => {
    // const code = new URL(window.location.href).searchParams.get("code");
    const url = window.location.href;
    console.log("현재 URL:", url); // 현재 URL을 확인하여 code 파라미터가 포함되어 있는지 확인

    const code = new URL(url).searchParams.get("code");
    if (code) {
      console.log("백엔드로 보낼 코드", code);
      // sendTokenBackend(code);
    }
  }, []); // 페이지 로드될 때 한 번 실행

  const sendTokenBackend = async (code) => {
    try {
      const response = await fetch("주소", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        const data = await response.json();
        // 백엔드에서 받은 데이터 처리
      } else {
        console.log("백 요청실패", response.statusText);
      }
    } catch (error) {
      console.log("백 요청 중 오류", error);
    }
  };

  return (
    <div className={styles.LoginPage}>
      <div>
        <img src={WeFAM} className={styles.WeFAM_Logo} />
        <h2 className={styles.subtitle}>우리 가족만을 위한 특별한 공간</h2>

        <div className={styles.buttonContainer}>
          <div className={styles.kakao_loginButton}>
            <img src={Kakao} className={styles.icon} />
            <button
              className={styles.KakaoLogin}
              onClick={() => {
                window.location.href = kakaoToken;
              }}
            >
              Kakao로 시작하기
            </button>
          </div>

          <div className={styles.naver_loginButton}>
            <img src={Naver} className={styles.icon} />
            <button className={styles.NaverLogin}>Naver로 시작하기</button>
          </div>

          <div className={styles.google_loginButton}>
            <img src={Google} className={styles.icon} />
            <button className={styles.GoogleLogin}>Google로 시작하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
