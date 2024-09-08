import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toggleLeftSidebar } from "../../features/leftSidebarSlice";
import { updateFamilyNick } from "../../features/familySlice"; // Redux 액션 가져오기
import styles from "./Header.module.css";
import { HiMiniBars3 } from "react-icons/hi2";
import logo from "../../assets/images/logo-text-segoe.png";

const Header = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();

  // Redux에서 familyNick 가져오기
  const familyNick = useSelector((state) => state.family.familyNick); // 가족 이름을 Redux에서 구독
  const userData = useSelector((state) => state.user.userData); // 사용자 정보 구독
  
  const [newFamilyNick, setNewFamilyNick] = useState(familyNick); // 입력된 값을 관리

  useEffect(() => {
    if (userData) {
      // 가족 이름 서버에서 가져오기
      axios
        .get(`http://localhost:8089/wefam/get-family-nick/${userData.id}`)
        .then((response) => {
          setNewFamilyNick(response.data);
          dispatch(updateFamilyNick(response.data)); // Redux 상태 업데이트
        })
        .catch((error) => {
          console.error("가족 이름을 가져오는 중 오류:", error);
        });
    }
  }, [userData, dispatch]);

  const handleFamilyNickChange = (e) => {
    setNewFamilyNick(e.target.value);
  };

  const updateFamilyNickHandler = () => {
    if (!newFamilyNick) {
      alert("가족 이름을 입력하세요.");
      return;
    }
    const updatedFamily = {
      familyIdx: 1,
      familyNick: newFamilyNick,
      userId: userData.id,
    };

    axios
      .put("http://localhost:8089/wefam/update-family-nick", updatedFamily)
      .then(() => {
        dispatch(updateFamilyNick(newFamilyNick)); // Redux 상태 업데이트
        console.log("가족 이름 업데이트 성공");
      })
      .catch((error) => {
        console.error("가족 이름 업데이트 실패:", error);
      });
  };

  const handleMenuClick = () => {
    dispatch(toggleLeftSidebar());
  };

  return (
    <div>
      <nav>
        <div className={styles.menuBtnContainer}>
          <button className={styles.menuBtn}>
            <HiMiniBars3 className={styles.menuIcon} onClick={handleMenuClick} />
          </button>
        </div>
        <div
          className={styles.logoContainer}
          onClick={() => {
            nav("/");
          }}
          style={{ cursor: "pointer" }}
        >
          {/* WeFAM로고 */}
          <img className={styles.logo} src={logo} alt="WeFAM 로고" />
        </div>
        <div className={styles.groupContainer}>{familyNick}</div>
      </nav>
    </div>
  );
};

export default Header;
