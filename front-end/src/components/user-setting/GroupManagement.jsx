import React, { useState, useEffect } from "react";
import styles from "./GroupManagement.module.css";
import { useSelector } from "react-redux";
import familyPT from "../../assets/images/famaily.png"; // 가족 프로필 사진 기본 이미지
import axios from "axios";

const GroupManagement = () => {
  // Redux에서 사용자 정보 가져오기
  const userData = useSelector((state) => state.user.userData);
  const [familyNick, setFamilyNick] = useState(""); // 현재 가족 이름
  const [newFamilyNick, setNewFamilyNick] = useState(""); // 수정할 가족 이름 상태
  const [familyMotto, setFamilyMotto] = useState(""); // 현재 가족 가훈
  const [newFamilyMotto, setNewFamilyMotto] = useState(""); // 수정할 가족 가훈 상태
  const [profileImage, setProfileImage] = useState(null); // 프로필 이미지 상태
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 파일 상태


  // 사용자 정보가 로드된 후 가족 이름과 가훈을 서버에서 불러오기 위한 useEffect
  useEffect(() => {
    if (userData) {
      // 가족 이름 불러오기
      axios.get(`http://localhost:8089/wefam/get-family-nick/${userData.id}`)
        .then(response => {
          setFamilyNick(response.data); // 서버에서 가져온 가족 이름 설정
          setNewFamilyNick(response.data); // 수정할 이름을 현재 가족 이름으로 설정
        })
        .catch(error => {
          console.error("가족 이름을 가져오는 중 에러 발생:", error);
        });

      // 가족 가훈 불러오기
      axios.get(`http://localhost:8089/wefam/get-family-motto/${userData.id}`)
        .then(response => {
          setFamilyMotto(response.data); // 서버에서 가져온 가훈 설정
          setNewFamilyMotto(response.data); // 수정할 가훈을 현재 가훈으로 설정
        })
        .catch(error => {
          console.error("가훈을 가져오는 중 에러 발생:", error);
        });

        // 프로필 이미지 불러오기
      axios.get(`http://localhost:8089/wefam/get-family-profile-photo/${userData.id}`)
      .then(response => {
        setProfileImage(`data:image/jpeg;base64,${response.data}`); // 서버에서 받은 이미지 설정
      })
      .catch(error => {
        console.error("프로필 이미지를 가져오는 중 에러 발생:", error);
      });
    }
  }, [userData]);

  // 가족 이름 입력 필드의 값이 변경될 때 호출되는 함수
  const handleFamilyNickChange = (e) => {
    setFamilyNick(e.target.value); // 입력된 가족 이름을 상태로 설정
  };

  // 가족 가훈 입력 필드의 값이 변경될 때 호출되는 함수
  const handleFamilyMottoChange = (e) => {
    setNewFamilyMotto(e.target.value); // 입력된 가훈을 상태로 설정
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setProfileImage(URL.createObjectURL(file)); // 미리보기로 설정
  };


  // 가족 이름을 서버에 업데이트하는 함수
  const updateFamilyNick = () => {
    if (!familyNick) {
      alert("가족 이름을 입력하세요."); // 가족 이름이 비어있는지 확인
      return;
    }

    const updatedFamily = {
      familyIdx: 1, // 가족 ID (실제로는 동적으로 받아와야 함)
      familyNick: familyNick, // 업데이트할 가족 이름
      userId: userData.id, // 현재 사용자의 ID
    };

    axios.put('http://localhost:8089/wefam/update-family-nick', updatedFamily)
      .then(response => {
        alert("가족이름이 변경되었습니다!"); // 성공 시 알림
        window.location.reload(); // 페이지 새로고침
        console.log('가족 이름 업데이트 성공:', response.data);
      })
      .catch(error => {
        console.error('가족 이름 업데이트 실패:', error); // 에러 처리
      });
  };

  // 가족 가훈을 서버에 업데이트하는 함수
  const updateFamilyMotto = () => {
    const updatedFamily = {
      familyIdx: 1, // 가족 ID (실제로는 동적으로 받아와야 함)
      familyMotto: newFamilyMotto, // 업데이트할 가족 가훈
      userId: userData.id, // 현재 사용자의 ID
    };

    axios.put('http://localhost:8089/wefam/update-family-motto', updatedFamily)
      .then(response => {
        alert("가족 가훈이 변경되었습니다!"); // 성공 시 알림
        window.location.reload(); // 페이지 새로고침
        console.log('가훈 업데이트 성공:', response.data);
      })
      .catch(error => {
        console.error('가훈 업데이트 실패:', error); // 에러 처리
      });
  };

  // 가족 프로필을 업데이트하는 함수
  const updateProfileImage =() => {
    if(!selectedImage){
      alert("이미지를 선택하세요");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", selectedImage);
    formData.append("familyIdx", userData.familyIdx);
    formData.append("userId", userData.id);

    axios.post('http://localhost:8089/wefam/update-family-profile-photo', formData)
    .then(response => {
      alert("프로필 사진이 변경되었습니다!");
      window.location.reload();
    })
    .catch(error => {
      console.error('프로필 사진 업데이트 실패:', error);
    });
};

  return (
    <div className={styles.personalInfo}>
      <h1>가족 정보 관리</h1>
      <hr />

      {/* 가족 프로필 사진 영역 */}
      <div className={styles.profileContainer}>
        <span>가족 프로필 사진</span>
        <div className={styles.profileInfo}>
        <img src={profileImage} className={styles.profileImg} alt="Family" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }} 
            id="profileImageInput"
          />
          <label htmlFor="profileImageInput" className={styles.editImgButton}>
            수정
          </label>
        </div>
      </div>
      <hr />

      {/* 가족 이름 수정 영역 */}
      <div className={styles.profileContainer}>
        <span>우리 가족 이름</span>
        <h2>{newFamilyNick}</h2> {/* 현재 가족 이름을 보여줌 */}
        <div>
          <input
            type="text"
            className={styles.editNick}
            value={familyNick}
            onChange={handleFamilyNickChange}
          />
          <button className={styles.editNickButton} onClick={updateFamilyNick}>
            수정
          </button>
        </div>
      </div>
      <hr />

      {/* 가족 가훈 수정 영역 */}
      <div className={styles.profileContainer}>
        <span>우리 가족 가훈</span>
        <h2>{familyMotto}</h2> {/* 현재 가족 가훈을 보여줌 */}
        <div>
          <input
            type="text"
            className={styles.editNick}
            value={newFamilyMotto}
            onChange={handleFamilyMottoChange}
          />
          <button className={styles.editNickButton} onClick={updateFamilyMotto}>
            수정
          </button>
        </div>
      </div>
      <hr />

    </div>
  );
};

export default GroupManagement;
