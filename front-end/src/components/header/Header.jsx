// 타임트리 젤 위의 헤더 부분입니다.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toggleLeftSidebar } from "../../features/leftSidebarSlice";
import styles from "./Header.module.css";
import { HiMiniBars3 } from "react-icons/hi2";
import logo from "../../assets/images/logo-text-segoe.png";
import add_group from "../../assets/images/add-group.png";
import AddCircle from "./AddCircle";

const Header = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [familyMotto, setFamilyMotto] = useState("");
  const groupName = "우리가족"; //임시 그룹명
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [userImages, setUserImages] = useState([]);
  const [groups, setGroups] = useState([]); // 그룹 목록 상태
  const [isAddCircleOpen, setIsAddCircleOpen] = useState(false);

  const handleMenuClick = () => {
    dispatch(toggleLeftSidebar());
  };

  // Redux에서 사용자 정보 가져오기
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (userData) {
      // 첫 번째 GET 요청: 가족 데이터를 가져옴
      axios
        .get("http://localhost:8089/wefam/get-family")
        .then((response) => {
          const loadedImages = response.data.map((user) => user.profileImg);
          setUserImages(loadedImages);
        })
        .catch((error) => {
          console.error("가져오기 에러!!", error);
        });
      // 두 번째 GET 요청: 가족 가훈을 가져옴
      axios
        .get(`http://localhost:8089/wefam/get-family-nick/${userData.id}`)
        .then((response) => {
          setFamilyMotto(response.data);
        })
        .catch((error) => {
          console.error("가훈 가져오기 에러:", error);
        });
    }
  }, [userData]); // userData가 변경될 때마다 실행

  const handleMottoChange = (e) => {
    setFamilyMotto(e.target.value);
  };

  const updateFamilyMotto = () => {
    if (!familyMotto) {
      alert("가훈을 입력하세요.");
      return;
    }
    const updatedFamily = {
      familyIdx: 1,
      familyMotto: familyMotto,
      userId: userData.id,
    };

    axios
      .put("http://localhost:8089/wefam/update-family-motto", updatedFamily)
      .then((response) => {
        console.log("가훈 업데이트 성공:");
      })
      .catch((error) => {
        console.error("가훈 업데이트 실패:", error);
      });
  };

  return (
    <div>
      <nav>
        <div className={styles.menuBtnContainer}>
          <button className={styles.menuBtn}>
            {/* 왼쪽 미니바 */}
            <HiMiniBars3
              className={styles.menuIcon}
              onClick={handleMenuClick}
            />
          </button>
        </div>
        <div
          className={styles.logoContainer}
          onClick={() => {
            nav("/");
          }}
          style={{ cursor: "pointer" }}>
          {/* WeFAM로고 */}
          <img className={styles.logo} src={logo}></img>
        </div>
        <div className={styles.groupContainer}>{familyMotto}</div>
        {/* <div className={styles.groupContainer}>
          <button onClick={openGroup} className={styles.groupBtn}>
            {groupName} ▼
          </button>
        </div> */}
      </nav>
    </div>
  );
};

export default Header;
