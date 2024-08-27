import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.css'
import WeFAM from '../../assets/images/WeFAM_logo.png.png'
import Kakao from '../../assets/images/Kakao.png'
import Naver from '../../assets/images/naver.png'
import Google from '../../assets/images/google.png'
import axios from 'axios'
import kakaoLogin from "react-kakao-login";

// 카카오 로그인
const REST_API_KEY = 'e8bed681390865b7c0ef4d85e4e2c842';
const REDIRECT_URI = 'http://localhost:3000/login';
const kakaoToken = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

// 네이버 로그인
const NAVER_CLIENT_ID = "Ww06wMPg4Td98siNlRth";
const NAVER_CALLBACK_URL = "http://localhost:3000/login";
const naverToken = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_CALLBACK_URL}`;

const LogIn = () => {
  const nav = useNavigate();

  //카카오로그인 핸들러
  const KakaoLogin = () => {
    window.location.href = kakaoToken;
  };

  // 네이버 로그인 핸들러
  const NaverLogin = () => {
    window.location.href = naverToken;
  };

  useEffect(() => {
    // 토큰값 추출
    const url = window.location.href;
    const code = new URL(url).searchParams.get("code");
    console.log("백으로 넘겨줄 거 : ",code);
    

    // 리다이렉트된 URI가 네이버인지 카카오인지 확인하여 처리
    if (url.includes('nid.naver.com')) {
      sendNaverTokenToBackend(code); // 네이버 코드 처리
    } else if (url.includes('kauth.kakao.com')) {
      sendKakaoTokenToBackend(code); // 카카오 코드 처리
    }
  }, []);

  const sendKakaoTokenToBackend = async (code) => {
    try {
      const response = await axios.post('http://localhost:8089/wefam/login', {
        code: code,
      });

      if (response.status === 200) {
        const data = response.data;
        console.log("카카오 사용자 정보 : ",data);
        nav("/");
      } else {
        console.log('카카오 백 요청 실패', response.statusText);
      }
    } catch (error) {
      console.log('카카오 백 요청 중 오류', error);
    }
  };

  const sendNaverTokenToBackend = async (code) => {
    try {
      const response = await axios.post('http://localhost:8089/wefam/login', {
        code: code,
      });

      if (response.status === 200) {
        const data = response.data;
        console.log("네이버 사용자 정보 : ", data);
        nav("/");
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
        <img src={WeFAM} className={styles.WeFAM_Logo} />
        <h2 className={styles.subtitle}>우리 가족만을 위한 특별한 공간</h2>


        <div className={styles.buttonContainer}>

          <div className={styles.kakao_loginButton}>
            <img src={Kakao} className={styles.icon} />
            <button className={styles.KakaoLogin} onClick={KakaoLogin}>Kakao로 시작하기</button>

          </div>

          <div className={styles.naver_loginButton}>
            <img src={Naver} className={styles.icon} />
            <button className={styles.NaverLogin} onClick={NaverLogin}>Naver로 시작하기</button>
          </div>
        </div>
      </div>
    </div>

  )
};

export default LogIn