import React, { useState, useEffect } from 'react';
import styles from './FamilyManagement.module.css';
import { useSelector } from "react-redux";
import axios from 'axios';
import ProfileModal from './ProfileModal';

const FamilyManagement = () => {
  const [users, setUsers] = useState([]);
  const userData = useSelector((state) => state.user.userData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    if (userData) {
      axios.get('http://localhost:8089/wefam/get-family')
        .then(response => {
          setUsers(response.data); // 사용자 정보 업데이트
        })
        .catch(error => {
          console.error("가져오기 에러!!", error);
        });
    }
  }, [userData]);

  const openModal = (user) => {
    setSelectedProfile(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  const handleInputChange = (e) => {
    setSelectedProfile({
      ...selectedProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveChanges = () => {
    console.log("프로필 업데이트:", selectedProfile);
    // 여기에서 서버에 프로필 변경 요청을 보낼 수 있습니다.
    closeModal();
  };

  return (
    <div className={styles.personalInfo}>
      <h1>가족 구성원 정보</h1>
      <hr />
      {users.map((user, index) => (
        <div key={index} className={styles.profileContainer}>
          <div className={styles.profileInfo}>
            <img 
              src={user.profileImg} 
              alt="Profile" 
              className={styles.profileImg} 
              onClick={() => openModal(user)} 
            />
            <span>{user.name}</span>
          </div>
          <hr />
        </div>
      ))}

      {selectedProfile && (
        <ProfileModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          profile={selectedProfile}
          isEditing={selectedProfile.id === userData.id} // 본인의 프로필인지 확인
          handleInputChange={handleInputChange}
          handleSaveChanges={handleSaveChanges}
        />
      )}
    </div>
  );
};

export default FamilyManagement;
