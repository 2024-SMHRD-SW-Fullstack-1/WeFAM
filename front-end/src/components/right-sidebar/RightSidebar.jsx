import React, { useState, useEffect } from "react";
import styles from "./RightSidebar.module.css";
import karina from '../../assets/images/karina.png'
import winter from '../../assets/images/winter.png'
import iu from '../../assets/images/iu.png'
import madong from '../../assets/images/madong.png'

const RightSidebar = ({userData}) => { //prop으로 받아옴
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (userData) {
      // 실제 카카오 사용자 데이터로 users 상태를 설정
      const loadedUsers = [
        { name: userData.name, image: userData.profileImg, online: true },
        // 필요한 다른 사용자 정보 추가
      ];
      setUsers(loadedUsers);
    } else {
      // 예시 사용자 데이터
      const exampleUsers = [
        { name: "원터", image: winter, online: true },
        { name: "카리나", image: karina, online: true },
        { name: "아이유", image: iu, online: false },
        { name: "마블리", image: madong, online: false }
      ];
      setUsers(exampleUsers);
    }
  }, [userData]); // userData가 변경될 때마다 실행
  
  return (
    <div className={styles.rightSidebar}>
      <div className={styles.onlineFamily}>
        <h2 className={styles.title}>현재 접속중인 가족</h2>
        <hr className={styles.separator} />
        <ul className={styles.userList}>
          {users.map((user, index) => (
            <li key={index} className={styles.userItem}>
            <img src={user.image} className={styles.userImage} alt={user.name} />
            <span className={styles.userName}>{user.name}</span>
            <span className={`${styles.status} ${user.online ? styles.online : styles.offline}`}></span>
          </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;
