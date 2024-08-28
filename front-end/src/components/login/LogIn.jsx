import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import WeFAM from '../../assets/images/WeFAM_logo.png.png';
import Kakao from '../../assets/images/Kakao.png';
import Naver from '../../assets/images/naver.png';
import axios from 'axios';
import RightSidebar from '../right-sidebar/RightSidebar';

// 카카오 로그인
const REST_API_KEY = 'e8bed681390865b7c0ef4d85e4e2c842';
const REDIRECT_URI = 'http://localhost:3000/login';
const kakaoToken = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

// 네이버 로그인
const NAVER_CLIENT_ID = "Ww06wMPg4Td98siNlRth";
const NAVER_CALLBACK_URL = "http://localhost:3000/login";
const naverToken = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_CALLBACK_URL}`;

const Login = () => {
  const [code, setCode] = useState(null);
  const [userData, setUserData] = useState(null); // 사용자 데이터를 저장할 상태 추가
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
    console.log("백으로 보내줄거 : ",code);
    setCode(code);
    sendKakaoTokenToBackend(code);
    
  }, []);



  const sendKakaoTokenToBackend = async (code) => {
    try {
      const response = await axios.post('http://localhost:8089/wefam/login', code, {
        headers: {
          'Content-Type': 'text/plain',  // 단순 문자열로 전달
        },
      });
  
      if (response.status === 200) {
        console.log("카카오 사용자 정보: ", response.data);
        nav("/");  // 리디렉션
      } else {
        console.log('카카오 백 요청 실패', response.statusText);
      }
    } catch (error) {
      console.log('카카오 백 요청 중 오류:', error.response ? error.response.data : error.message);
    }
  };

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
      {userData && <RightSidebar users={[userData]} />} {/* userData가 존재할 때만 RightSidebar 렌더링 */}
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

export default Login;
