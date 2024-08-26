import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.css'
import WeFAM from '../../assets/images/WeFAM_logo.png.png'
import Kakao from '../../assets/images/Kakao.png'
import Naver from '../../assets/images/naver.png'
import Google from '../../assets/images/google.png'

const LogIn = () => {
  const nav = useNavigate();

  useEffect(() => {
    // 로그아웃 처리 로직

    nav("/login");

  });


  return (
    <div className={styles.LoginPage}>
      <div>
        <img src={WeFAM} className={styles.WeFAM_Logo} />
        <h2 className={styles.subtitle}>우리 가족만을 위한 특별한 공간</h2>


        <div className={styles.buttonContainer}>

          <div className={styles.kakao_loginButton}>
            <img src={Kakao} className={styles.icon} />
            <button className={styles.KakaoLogin}>Kakao로 시작하기</button>
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

  )
};

export default LogIn