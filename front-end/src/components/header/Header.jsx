// 타임트리 젤 위의 헤더 부분입니다.
import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { HiMiniBars3 } from "react-icons/hi2";
import WeFAMlogo from "../../assets/images/logo.png";
import karina from "../../assets/images/karina.png";
import winter from "../../assets/images/winter.png";
import iu from "../../assets/images/iu.png";
import madong from "../../assets/images/madong.png";
import backji from "../../assets/images/backjihyeng.png";
import nosa from "../../assets/images/nosayean.png";
import leemusong from "../../assets/images/leemusong.png";
import add_group from "../../assets/images/add-group.png";
import Modal from "react-modal";
import AddCircle from "./AddCircle";
import { elapsedTime } from "../../elapsedTime";
import { useSelector } from "react-redux";
import axios from "axios";

const Header = () => {
  const address = "광주광역시 동구 중앙로 196";


  // getCoordinates(address);

  const groupName = "우리가족"; //임시 그룹명
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [userImages, setUserImages] = useState([]);
  const [groups, setGroups] = useState([]); // 그룹 목록 상태
  const [isAddCircleOpen, setIsAddCircleOpen] = useState(false);

  // Redux에서 사용자 정보 가져오기
  const userData = useSelector((state) => state.user.userData);

  const openGroup = () => {
    setIsGroupOpen(true);
  };

  const closeGroup = () => {
    setIsGroupOpen(false);
  };

  const openAddCircle = () => {
    setIsAddCircleOpen(true);
  };

  const closeAddCircle = () => {
    setIsAddCircleOpen(false);
  };

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
    } else {
      // 예시 사용자 데이터
      const exampleImages = [karina, winter, iu, madong];
      setUserImages(exampleImages);
    }
  }, [userData]); // userData가 변경될 때마다 실행

  return (
    <div>
      <nav className={styles.topBar}>
        <div className={styles.groupListContainer}>
          <button className={styles.groupListBtn}>
            {/* 왼쪽 미니바 */}
            <HiMiniBars3 className={styles.groupListIcon} />
          </button>
          {/* WeFAM로고 */}
          <img className={styles.WeFAMlogo} src={WeFAMlogo}></img>
        </div>

        <div className={styles.groupNameContainer}>
          <button onClick={openGroup} className={styles.groupNameButton}>
            {groupName} ▼
          </button>
        </div>

        <Modal
          isOpen={isGroupOpen}
          onRequestClose={closeGroup}
          className={styles.modalContent}
          overlayClassName={styles.modalOverlay}
        >
          <div className={styles.modalHeader}>
            <div className={styles.modalHeaderTop}>
              <button onClick={closeGroup} className={styles.closeGroupButton}>
                <h2>{groupName} ▲</h2>
              </button>
              <div className={styles.groupProfileContainer}>
               
                {/* 카카오 프로필 이미지 */}
                {userImages.map((image, index) => (
                  <img key={index} src={image} className={styles.groupProfileContainer} alt={`user-${index}`} />
                ))}
                <img
                  className={styles.profileImage}
                  src={add_group}
                  alt="add-group"
                  onClick={openAddCircle}
                />
              </div>
            </div>
          </div>
        </Modal>

        <AddCircle isOpen={isAddCircleOpen} onRequestClose={closeAddCircle} />
      </nav>
    </div>
  );
};

export default Header;
