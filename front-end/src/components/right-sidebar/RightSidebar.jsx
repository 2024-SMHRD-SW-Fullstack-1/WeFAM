import React, { useState, useEffect } from "react";
import styles from "./RightSidebar.module.css";
import karina from '../../assets/images/karina.png'
import winter from '../../assets/images/winter.png'
import iu from '../../assets/images/iu.png'
import madong from '../../assets/images/madong.png'

const RightSidebar = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // 통신되기 전 일단 예시
    const exampleUsers = [
      { name: "원터", image: winter, online: true },
      { name: "카리나", image: karina, online: true },
      { name: "아이유", image: iu, online: false },
      { name: "마블리", image: madong, online: false }
    ];

    setUsers(exampleUsers); //api되면 여기에 호출

  }, []); // 빈 배열을 두 번째 인자로 전달하여 컴포넌트가 마운트될 때만 실행되도록 설정
  
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
