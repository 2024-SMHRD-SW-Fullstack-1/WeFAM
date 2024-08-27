// 타임트리 젤 위의 헤더 부분입니다.
import React from "react";
import styles from "./Header.module.css";
import { HiMiniBars3 } from "react-icons/hi2";
import WeFAMlogo from '../../assets/images/logo.png'
import karina from '../../assets/images/karina.png'
import winter from '../../assets/images/winter.png'
import iu from '../../assets/images/iu.png'
import madong from '../../assets/images/madong.png'
import backji from '../../assets/images/backjihyeng.png'
import nosa from '../../assets/images/nosayean.png'
import leemusong from '../../assets/images/leemusong.png'
import add_group from '../../assets/images/add-group.png'
import { useState } from "react";
import Modal from 'react-modal';
import AddCircle from "./AddCircle";

const Header = () => {
  const groupName = "우리가족"; //임시 그룹명
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [groups, setGroups] = useState([]); // 그룹 목록 상태
  const [isAddCircleOpen, setIsAddCircleOpen] = useState(false);

  const openGroup = () => {
    setIsGroupOpen(true);
  }

  const closeGroup = () => {
    setIsGroupOpen(false);
  }

  const openAddCircle = () => {
    setIsAddCircleOpen(true);
  };

  const closeAddCircle = () => {
    setIsAddCircleOpen(false);
  };

  // const addGroup = () => {
  //   const newGroupName = prompt("새 그룹명을 입력하세요."); // 그룹 이름 입력 받기
  //   if (newGroupName) {
  //     setGroups([...groups, newGroupName]);
  //   }
  // };

  return (
    <div >
      <nav className={styles.topBar}>
        <div className={styles.groupListContainer}>
          <button className={styles.groupListBtn}>
            {/* 왼쪽 미니바 */}
            <HiMiniBars3 className={styles.groupListIcon} />
          </button>
          {/* WeFAM로고 */}
          <img
            className={styles.WeFAMlogo}
            src={WeFAMlogo}
          ></img>
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
                {/* 우리가족 멤버 이미지 */}

                <img className={styles.profileImage} src={karina} alt='karina'></img>

                <img className={styles.profileImage} src={backji} alt='backji'></img>

                <img className={styles.profileImage} src={nosa} alt='nosa'></img>

                <img className={styles.profileImage} src={leemusong} alt='leemusong'></img>

                <img className={styles.profileImage} src={add_group} alt="add-group" onClick={openAddCircle} />
              </div>
            </div>
          </div>
          <div className={styles.modalBody}>
            {groups.map((group, index) => (
              <div key={index} className={styles.groupSection}>
                <p>{group}</p>
                {/* 그룹 멤버 */}
                <div className={styles.profileContainer}>
                  <img className={styles.profileImage} src={karina} alt='karina'></img>
                  <img className={styles.profileImage} src={winter} alt='winter'></img>
                  <img className={styles.profileImage} src={iu} alt='iu'></img>
                  <img className={styles.profileImage} src={madong} alt='madong'></img>
                </div>
              </div>
            ))}
            <div className={styles.addGroupSection}>
              
            </div>
          </div>
        </Modal>

        <AddCircle isOpen={isAddCircleOpen} onRequestClose={closeAddCircle} />

       
      </nav>
    </div>
  );
};

export default Header;