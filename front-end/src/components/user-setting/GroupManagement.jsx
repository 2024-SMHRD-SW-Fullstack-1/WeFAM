// GroupManagement.js
import React, { useState, useEffect } from "react";
import styles from "./GroupManagement.module.css";
import { useSelector } from "react-redux";
import familyPT from "../../assets/images/famaily.png";
import axios from "axios";


const GroupManagement = () => {
  const [userImages, setUserImages] = useState([]);
  // Redux에서 사용자 정보 가져오기
  const userData = useSelector((state) => state.user.userData);
  const [nickname, setNickname] = useState(userData ? userData.name : "");
  const [familyNick, setFamilyNick] = useState(""); // 현재 가족 이름
  const [newFamilyNick, setNewFamilyNick] = useState(""); // 수정할 가족 이름 상태
  const [familyMotto, setFamilyMotto] = useState(""); // 가족 가훈
  const [newFamilyMotto, setNewFamilyMotto] = useState("") // 수정할 가훈 상태

  // 가족 닉네임을 불러오기 위한 useEffect
  useEffect(() => {
    if (userData) {
      // 서버에서 가족 닉네임 가져오기
      axios.get(`http://localhost:8089/wefam/get-family-nick/${userData.id}`)
        .then(response => {
          setFamilyNick(response.data); // 서버에서 가져온 가족 이름 설정
          setNewFamilyNick(response.data); // 수정할 이름을 현재 가족 이름으로 설정
        })
        .catch(error => {
          console.error("가족 이름을 가져오는 중 에러 발생:", error);
        });

      axios.get(`http://localhost:8089/wefam/get-family-motto/${userData.id}`)
        .then(response => {
          setFamilyMotto(response.data); // 서버에서 가져온 가훈 
          setNewFamilyMotto(response.data); // 수정할 가훈을 현재 가훈으로 설정

        })
        .catch(error => {
          console.error("가훈을 가져오는 중 에러 발생:", error);
        });
    }
  }, [userData]);

  const handleFamilyNickChange = (e) => {
    setFamilyNick(e.target.value);
  };

  const handleFamilyMottoChange = (e) => {
    setNewFamilyMotto(e.target.value);
  };

  const updateFamilyNick = () => {
    alert("가족이름이 변경되었습니다!")
    window.location.reload();
    
    if (!familyNick) {
      alert("가족 이름을 입력하세요.");
      return;
    }

    const updatedFamily = {
      familyIdx: 1,
      familyNick: familyNick,
      userId: userData.id
    };

    axios.put('http://localhost:8089/wefam/update-family-nick', updatedFamily)
      .then(response => {
        console.log('가족 이름 업데이트 성공:', response.data);
      })
      .catch(error => {
        console.error('가족 이름 업데이트 실패:', error);
      });
  };

  const updateFamilyMotto = () => {
    alert("가족 가훈이 변경되었습니다!")
    window.location.reload();
    

    const updatedFamily = {
      familyIdx: 1,
      familyMotto: newFamilyMotto,
      userId: userData.id
    };

    axios.put('http://localhost:8089/wefam/update-family-motto', updatedFamily)
      .then(response => {
        console.log('가훈 업데이트 성공:', response.data);
      })
      .catch(error => {
        console.error('가훈 업데이트 실패:', error);
      });
  };


  return (
    <div className={styles.personalInfo}>
      <h1>가족 정보 관리</h1>
      <hr />
      <div className={styles.profileContainer}>
        <span>가족 프로필 사진</span>
        <div className={styles.profileInfo}>
          <img src={familyPT} className={styles.profileImg} alt="Family" />

          <button className={styles.editImgButton}>수정</button>
        </div>
      </div>
      <hr />
      <div className={styles.profileContainer}>
        <span>우리 가족 이름</span>
        <h2>{newFamilyNick}</h2> {/* 여기에 familyNick 상태를 표시 */}
        <div>
          <input
            type="text"
            className={styles.editNick}
            value={familyNick}
            onChange={handleFamilyNickChange}
          />{" "}
          <button className={styles.editNickButton} onClick={updateFamilyNick}>
            수정
          </button>
        </div>
      </div>
      <hr />
      <div className={styles.profileContainer}>
        <span>우리 가족 가훈</span>
        <h2>{familyMotto}</h2>
        <div>
          <input
            type="text"
            className={styles.editNick}
            value={newFamilyMotto}
            onChange={handleFamilyMottoChange}
          />{" "}
          <button className={styles.editNickButton} onClick={updateFamilyMotto}>
            수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupManagement;
