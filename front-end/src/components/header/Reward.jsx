import React, { useState, useEffect, useRef } from "react";
import styles from "./Reward.module.css";
import AddRewardModal from "./AddRewardModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { BsThreeDots, BsPlusCircle } from "react-icons/bs";
import DeleteModal from "../modal/DeleteModal";

const Reward = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [rewards, setRewards] = useState([]); // 보상 리스트 상태
  const [selectedReward, setSelectedReward] = useState(null); // 선택된 보상 아이템
  const [dropdownOpen, setDropdownOpen] = useState(null); // 드롭다운 상태
  const [totalPoints, setTotalPoints] = useState(0); // 유저의 총 포인트 상태 추가
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const userId = useSelector((state) => state.user.userData.id);
  const dropdownRef = useRef([]); // 각 드롭다운의 참조 배열
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // 삭제 모달 상태
  const [rewardToDelete, setRewardToDelete] = useState(null); // 삭제할 보상 아이템 저장



  const goToRewardPoint = () => {
    navigate("/main/reward-point");
  };

  // 유저의 총 포인트 불러오기
  const fetchTotalPoints = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8089/wefam/get-user-data?userId=${userId}`
      );
      setTotalPoints(response.data.points); // 유저의 총 포인트 상태 설정
    } catch (error) {
      console.error("유저의 포인트를 불러오는 중 오류 발생:", error);
    }
  };

  // 보상 데이터 불러오기
  const fetchRewards = async () => {
    try {
      const response = await axios.get("http://localhost:8089/wefam/rewards");
      const availableRewards = response.data.filter(
        (reward) => !reward.reward.isSold
      );
      setRewards(availableRewards);
    } catch (error) {
      console.error("보상 목록 불러오기 오류 발생:", error);
    }
  };

  const handleAddReward = async (newReward) => {
    try {
      const formData = new FormData();
      formData.append("rewardName", newReward.rewardName);
      formData.append("rewardPoints", newReward.rewardPoints || 0);
      formData.append("userId", userId);
      if (newReward.image) {
        formData.append("image", newReward.image);
      }

      if (newReward.rewardIdx) {
        await axios.post(
          `http://localhost:8089/wefam/rewards/${newReward.rewardIdx}/update`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:8089/wefam/rewards",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      fetchRewards();
    } catch (error) {
      console.error("보상 저장 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchRewards();
    fetchTotalPoints();
  }, []);

  // 드롭다운 열기 및 닫기
  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index); // 동일한 방식으로 토글 관리
  };

  // 외부 클릭 감지로 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 드롭다운 메뉴 외부 클릭 시
      if (dropdownRef.current && dropdownRef.current.some(ref => ref && !ref.contains(event.target))) {
        setDropdownOpen(null); // 드롭다운 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditReward = (reward) => {
    setSelectedReward(reward);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (rewardToDelete) {
      try {
        await axios.post(
          `http://localhost:8089/wefam/rewards/${rewardToDelete.reward.rewardIdx}/delete`
        );
        fetchRewards(); // 보상 목록 새로고침
        setIsDeleteOpen(false); // 모달 닫기
        setRewardToDelete(null); // 삭제할 보상 초기화
      } catch (error) {
        console.error("보상 삭제 중 오류 발생:", error);
      }
    }
  };

  const handleDeleteClick = (reward) => {
    setRewardToDelete(reward); // 삭제할 보상 설정
    setIsDeleteOpen(true); // 모달 열기
  };

  const handleDeleteReward = (reward) => {
    handleDeleteClick(reward); // 보상 삭제 클릭 시 모달 열기
  };

  const handlePurchaseReward = async (reward) => {
    if (reward.reward.rewardPoint > totalPoints) {
      alert("포인트가 부족합니다!");
      return;
    }

    if (window.confirm(`${reward.reward.rewardName}을(를) 구매하시겠습니까?`)) {
      try {
        await axios.post(
          `http://localhost:8089/wefam/rewards/${reward.reward.rewardIdx}/purchase`,
          null,
          {
            params: { userId },
          }
        );
        fetchTotalPoints();
        fetchRewards();
      } catch (error) {
        console.error("구매 중 오류 발생:", error);
      }
    }
  };

  return (
    <div className="main">
      <div className={styles.container}>
        <div className={styles.titleGroup}>
          <div className={styles.leftTitleGroup}>
            <div className={styles.iconTitleGroup}>
              <div className={styles.icon}>
                <i
                  style={{
                    backgroundImage:
                      'url("https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/jGIHAYEO3Pc.png")',
                    backgroundSize: "auto",
                    width: "36px",
                    height: "36px",
                    backgroundRepeat: "no-repeat",
                    display: "inline-block",
                  }}
                  aria-hidden="true"
                ></i>
                {/* <HiOutlineTrophy /> */}
              </div>
              <h1>포인트 상점</h1>
            </div>
            <div>
              <button
                className={styles.rewardPointButton}
                onClick={goToRewardPoint}
              >
                포인트 확인
              </button>
            </div>
          </div>

          <BsPlusCircle
            className={styles.btnAdd}
            onClick={() => {
              setSelectedReward(null);
              setIsModalOpen(true);
            }}
          />
        </div>

        <div className={styles.itemsContainer}>
          {rewards.map((rewardItem, index) => (
            <div key={index} className={styles.itemCard}>
              <div className={styles.cardHeader}>
                <BsThreeDots
                  className={styles.menuIcon}
                  onClick={() => toggleDropdown(index)}
                />
                {dropdownOpen === index && (
                  <div className={styles.dropdownMenu} ref={(el) => (dropdownRef.current[index] = el)}>
                    <p onClick={() => handleEditReward(rewardItem)}>수정</p>
                    <p onClick={() => handleDeleteReward(rewardItem)}>삭제</p>
                  </div>
                )}
              </div>
              <img
                src={rewardItem.imageBase64}
                alt={rewardItem.reward.rewardName}
                className={styles.rewardImage}
              />
              <h2>{rewardItem.reward.rewardName}</h2>
              <p>{rewardItem.reward.rewardPoint} Points</p>
              <div>
                <button
                  onClick={() => handlePurchaseReward(rewardItem)}
                  className={styles.buyButton}
                >
                  구매
                </button>
              </div>
            </div>
          ))}
        </div>

        <AddRewardModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onAddReward={handleAddReward}
          selectedReward={selectedReward}
        />

        <DeleteModal
          showModal={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)} // 모달 닫기
          onConfirm={handleDeleteConfirm} // 삭제 확인 시 실제 삭제 실행
        />
      </div>
    </div>
  );
};

export default Reward;
