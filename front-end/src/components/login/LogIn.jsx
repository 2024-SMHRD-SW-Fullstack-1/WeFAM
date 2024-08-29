import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.css'
import WeFAM from '../../assets/images/WeFAM_logo.png.png'
import Kakao from '../../assets/images/Kakao.png'
import Naver from '../../assets/images/naver.png'
import Google from '../../assets/images/google.png'
import axios from 'axios'

const LogIn = () => {
  const nav = useNavigate();

  useEffect(() => {
    const url = window.location.href;
    const TockenCode = new URL(url).searchParams.get("code");
    if (TockenCode) {
      console.log("백엔드로 보낼 토큰 값 : ", TockenCode);
      sendKakaoTokenToBackend(TockenCode);
    } else {
      // code가 없을 때만 /login으로 리다이렉트
      nav("/login");
    }
  }, [nav]);

  //카카오 로그인
  const REST_API_KEY = 'e8bed681390865b7c0ef4d85e4e2c842';
  const REDIRECT_URI = 'http://localhost:3000/login';
  const kakaoToken = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

  //네이버 로그인
  const NAVER_CLIENT_ID = "Ww06wMPg4Td98siNlRth";
  const NAVER_CALLBACK_URL = "http://localhost:3000/login";
  const naverToken = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_CALLBACK_URL}`;
  

  const sendKakaoTokenToBackend = async (code) => {
    try {
      const response = await axios.post('http://localhost:8089/wefam/login', {
        
        code: code
      });

      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        
        // 백엔드에서 받은 데이터 처리
      } else {
        console.log('카카오 백 요청 실패', response.statusText);
      }
    } catch (error) {
      console.log('카카오 백 요청 중 오류', error);
    }
  };

const sendNaverTokenToBackend = async (code) => {
    try {
      const response = await axios.post('네이버 백엔드 주소', {
        code: code
      });

      if (response.status === 200) {
        const data = response.data;
        // 백엔드에서 받은 데이터 처리
      } else {
        console.log('네이버 백 요청 실패', response.statusText);
      }
    } catch (error) {
      console.log('네이버 백 요청 중 오류', error);
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
            <button className={styles.KakaoLogin} onClick={() => { window.location.href = kakaoToken }}>Kakao로 시작하기</button>

          </div>

          <div className={styles.naver_loginButton}>
            <img src={Naver} className={styles.icon} />
            <button className={styles.NaverLogin} onClick={()=>{ window.location.href = naverToken}}>Naver로 시작하기</button>
          </div>

          <div className={styles.google_loginButton}>
            <img src={Google} className={styles.icon} />
            <button className={styles.GoogleLogin}>Google로 시작하기</button>
          </div>

        </div>


      </div>
    </div>

  )
};

export default LogIn