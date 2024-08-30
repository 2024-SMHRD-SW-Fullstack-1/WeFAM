import React, { useState, useEffect } from 'react';
import styles from './FamilyManagement.module.css';
import { useSelector } from "react-redux";
import axios from 'axios';

const FamilyManagement = () => {
  const [userImages, setUserImages] = useState([]);
  const [users, setUsers] = useState([]);
  const userData = useSelector((state) => state.user.userData);
  const [nickname, setNickname] = useState(userData ? userData.name : "");
  
  // 전역 변수로 설정된 loadedImages
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    if (userData) {
      axios.get('http://localhost:8089/wefam/get-family')
        .then(response => {
          const images = response.data.map(user => user.profileImg);
          setLoadedImages(images);  // loadedImages 상태 업데이트
          setUsers(response.data); // 사용자 정보도 업데이트
        })
        .catch(error => {
          console.error("가져오기 에러!!", error);
        });
    }
  }, [userData]);

  return (
    <div className={styles.personalInfo}>
      <h1>가족 구성원 관리</h1>
      <hr />
      <div className={styles.profileContainer}>
        <div className={styles.profileInfo}>
          {<img src={userData.profileImg} alt="Profile" className={styles.profileImg} />}
          <span>{userData.name}</span> {/* 사용자 이름 표시 */}
          <button>구성원 떠나기</button>
        </div>
      </div>
      <hr />
      {users.map((user, index) => (
        <div key={index} className={styles.profileContainer}>
          <div className={styles.profileInfo}>
            <img src={user.profileImg} alt="Profile" className={styles.profileImg} />
            <span>{user.name}</span>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default FamilyManagement;
