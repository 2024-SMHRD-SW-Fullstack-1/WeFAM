// PersonalInfo.js
import React, { useState, useEffect } from 'react';
import styles from './FamilyManagement.module.css';
import { useSelector } from "react-redux";
import axios from 'axios';

const FamilyManagement = () => {
  const [userImages, setUserImages] = useState([]);
  const [users, setUsers] = useState([]);
  // Redux에서 사용자 정보 가져오기
  const userData = useSelector((state) => state.user.userData);
  const [nickname, setNickname] = useState(userData ? userData.name : "");

  useEffect(() => {
    if (userData) {
      // 실제 사용자 데이터를 가져오는 axios 요청
      axios.get('http://localhost:8089/wefam/get-family')
        .then(response => {
          const loadedImages = response.data.map(user => user.profileImg);
          setUserImages(loadedImages);
        })
        .catch(error => {
          console.error("가져오기 에러!!", error);
        });
    }
  }, [userData]); // userData가 변경될 때마다 실행
const images = 'data:image/jpeg;base64,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'



  return (
    <div className={styles.personalInfo}>
      <h1>가족 구성원 관리</h1>
      <hr />
      <div className={styles.profileContainer}>
        <div className={styles.profileInfo}>
          {<img src={userData.profileImg} alt="Profile" className={styles.profileImg} />}
          <span>{userData.name}</span> {/* 여기에는 user.data 받아서 이름 넣어야댐 */}
          <button>구성원 떠나기</button>
        </div>
      </div>
      <hr />
      <div className={styles.profileContainer}>
        <img src={userImages[1]} alt="" className={styles.profileImg} />
      <span>{userData.nick}</span>
      </div>
      <hr />
      {users.map((user, index) => (
        <div key={index} className={styles.profileContainer}>
          <div className={styles.profileInfo}>
            <img src={user.profileImg} alt="Profile" className={styles.profileImg} />
            <span>{user.name}</span>
            <button>구성원 떠나기</button>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default FamilyManagement;



