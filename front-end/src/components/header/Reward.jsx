import React, { useState, useEffect, useRef } from "react";
import styles from "./Reward.module.css";
import AddRewardModal from "./AddRewardModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";

const Reward = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [rewards, setRewards] = useState([]); // 보상 리스트 상태
  const [selectedReward, setSelectedReward] = useState(null); // 선택된 보상 아이템
  const [dropdownOpen, setDropdownOpen] = useState(null); // 드롭다운 상태
  const [totalPoints, setTotalPoints] = useState(0); // 유저의 총 포인트 상태 추가
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const userId = useSelector((state) => state.user.userData.id);
  const dropdownRef = useRef(null); // 드롭다운 참조

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
      // 구매되지 않은 보상만 표시
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

      // 보상 ID가 있으면 수정, 없으면 추가
      if (newReward.rewardIdx) {
        const response = await axios.post(
          `http://localhost:8089/wefam/rewards/${newReward.rewardIdx}/update`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("보상 수정 성공:", response.data);
      } else {
        const response = await axios.post(
          "http://localhost:8089/wefam/rewards",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("보상 추가 성공:", response.data);
      }

      fetchRewards(); // 보상 목록 다시 불러오기
    } catch (error) {
      console.error("보상 저장 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchRewards();
    fetchTotalPoints(); // 유저의 총 포인트도 불러오기
  }, []);

  // 드롭다운 열기 및 닫기
  const toggleDropdown = (index) => {
    if (dropdownOpen === index) {
      setDropdownOpen(null); // 현재 열려있는 드롭다운을 닫음
    } else {
      setDropdownOpen(index); // 선택한 드롭다운을 엶
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null); // 외부 클릭 시 드롭다운 닫기
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleEditReward = (reward) => {
    setSelectedReward(reward); // 선택된 보상 데이터를 설정
    setIsModalOpen(true); // 모달 열기
  };

  const handleDeleteReward = async (reward) => {
    if (window.confirm("이 보상을 삭제하시겠습니까?")) {
      try {
        await axios.post(
          `http://localhost:8089/wefam/rewards/${reward.reward.rewardIdx}/delete`
        );
        console.log("삭제 성공:", reward.reward.rewardName);
        fetchRewards(); // 삭제 후 보상 목록 다시 불러오기
      } catch (error) {
        console.error("보상 삭제 중 오류 발생:", error);
      }
    }
  };

  const handlePurchaseReward = async (reward) => {
    if (reward.reward.rewardPoint > totalPoints) {
      alert("포인트가 부족합니다!");
      return;
    }

    if (window.confirm(`${reward.reward.rewardName}을(를) 구매하시겠습니까?`)) {
      try {
        const response = await axios.post(
          `http://localhost:8089/wefam/rewards/${reward.reward.rewardIdx}/purchase`,
          null,
          {
            params: {
              userId: userId,
            },
          }
        );
        console.log("구매 성공:", response.data);

        // 보상 구매 후 유저의 포인트 다시 불러오기
        await fetchTotalPoints();

        fetchRewards(); // 구매 후 보상 목록 다시 불러오기
      } catch (error) {
        console.error("구매 중 오류 발생:", error);
      }
    }
  };

  return (
    <div className="main">
      <div className={styles.container}>
        <div className={styles.buttonGroup}>
          {/* RewardPoint 페이지로 이동 버튼 */}
          <button
            className={styles.rewardPointButton}
            onClick={goToRewardPoint}
          >
            포인트 확인하기
          </button>

          {/* 보상 추가 버튼 */}
          <button
            className={styles.addButton}
            onClick={() => {
              setSelectedReward(null); // 추가 버튼을 눌렀을 때 선택된 보상 데이터를 초기화
              setIsModalOpen(true);
            }}
          >
            보상 추가
          </button>
        </div>

        {/* 보상 아이템들을 보여주는 영역 */}
        <div className={styles.itemsContainer}>
          {rewards.map((rewardItem, index) => (
            <div key={index} className={styles.itemCard}>
              <div className={styles.cardHeader}>
                <BsThreeDotsVertical
                  className={styles.menuIcon}
                  onClick={() => toggleDropdown(index)}
                />
                {dropdownOpen === index && (
                  <div className={styles.dropdownMenu} ref={dropdownRef}>
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

        {/* 보상 추가 또는 수정 모달 */}
        <AddRewardModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onAddReward={handleAddReward}
          selectedReward={selectedReward}
        />
      </div>
    </div>
  );
};

export default Reward;
