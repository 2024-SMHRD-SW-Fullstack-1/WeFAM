// 보상 페이지 컴포넌트
import React, { useState, useEffect, useRef } from "react";
import styles from "./Reward.module.css";
import AddRewardModal from "./AddRewardModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { BsThreeDots, BsPlusCircle } from "react-icons/bs";
import DeleteModal from "../modal/DeleteModal";
import ConfirmModal from "../modal/ConfirmModal"; // ConfirmModal 임포트
import modalPointIcon from "../../assets/images/modalPointIcon.png";
import { toastSuccess, toastDelete } from "../Toast/showCustomToast";

const Reward = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 추가 및 수정 모달 상태 관리
  const [rewards, setRewards] = useState([]); // 보상 리스트 상태 관리
  const [selectedReward, setSelectedReward] = useState(null); // 선택된 보상 상태
  const [dropdownOpen, setDropdownOpen] = useState(null); // 드롭다운 상태 관리
  const [totalPoints, setTotalPoints] = useState(0); // 유저의 총 포인트 상태 관리
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // 삭제 모달 상태
  const [rewardToDelete, setRewardToDelete] = useState(null); // 삭제할 보상 아이템 상태
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // 구매 확인 모달 상태
  const [rewardToPurchase, setRewardToPurchase] = useState(null); // 구매할 보상 아이템 상태

  const navigate = useNavigate(); // 페이지 이동을 위한 hook
  const userId = useSelector((state) => state.user.userData.id); // Redux에서 유저 ID 가져오기
  const dropdownRef = useRef([]); // 드롭다운 참조 배열

  const goToRewardPoint = () => {
    navigate("/main/reward-point"); // 포인트 확인 페이지로 이동
  };

  // 유저의 총 포인트 불러오기
  const fetchTotalPoints = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8089/wefam/get-user-data?userId=${userId}`
      );
      setTotalPoints(response.data.points); // 유저의 총 포인트 설정
    } catch (error) {
      toastDelete("포인트를 불러오는데 실패했습니다!"); // 오류 시 토스트 메시지 출력
    }
  };

  // 보상 데이터 불러오기
  const fetchRewards = async () => {
    try {
      const response = await axios.get("http://localhost:8089/wefam/rewards");
      const availableRewards = response.data
        .sort((a, b) => b.reward.rewardPoint - a.reward.rewardPoint); // 포인트 기준으로 내림차순 정렬
      setRewards(availableRewards); // 보상 리스트 업데이트
    } catch (error) {
      toastDelete("상품을 불러오는데 실패했습니다!"); // 오류 시 토스트 메시지 출력
    }
  };

  // 새로운 보상 추가 및 수정
  const handleAddReward = async (newReward) => {
    try {
      const formData = new FormData();
      formData.append("rewardName", newReward.rewardName); // 보상 이름 추가
      formData.append("rewardPoints", newReward.rewardPoints || 0); // 보상 포인트 추가
      formData.append("userId", userId); // 유저 ID 추가
      if (newReward.image) {
        formData.append("image", newReward.image); // 이미지 파일 추가
      }

      // 보상 수정 또는 신규 추가 처리
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
        toastSuccess("상품수정이 성공적으로 완료되었습니다!"); // 성공 메시지 출력
      } else {
        await axios.post("http://localhost:8089/wefam/rewards", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toastSuccess("상품등록이 성공적으로 완료되었습니다!"); // 성공 메시지 출력
      }

      fetchRewards(); // 보상 목록 새로고침
    } catch (error) {
      toastDelete("작업에 실패했습니다!"); // 오류 시 메시지 출력
    }
  };

  useEffect(() => {
    fetchRewards(); // 페이지 로드시 보상 목록 불러오기
    fetchTotalPoints(); // 페이지 로드시 총 포인트 불러오기
  }, []);

  // 드롭다운 열기 및 닫기
  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index); // 동일한 드롭다운을 다시 클릭하면 닫기
  };

  // 외부 클릭으로 드롭다운 닫기 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        dropdownRef.current.some((ref) => ref && !ref.contains(event.target))
      ) {
        setDropdownOpen(null); // 외부 클릭 시 드롭다운 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, []);

  // 보상 수정 처리
  const handleEditReward = (reward) => {
    setSelectedReward(reward); // 선택된 보상 설정
    setIsModalOpen(true); // 수정 모달 열기
  };

  // 보상 삭제 처리
  const handleDeleteConfirm = async () => {
    if (rewardToDelete) {
      try {
        await axios.post(
          `http://localhost:8089/wefam/rewards/${rewardToDelete.reward.rewardIdx}/delete`
        );
        toastSuccess("상품이 성공적으로 삭제되었습니다!"); // 성공 메시지 출력
        fetchRewards(); // 보상 목록 새로고침
        setIsDeleteOpen(false); // 삭제 모달 닫기
        setRewardToDelete(null); // 삭제할 보상 초기화
      } catch (error) {
        toastDelete("작업에 실패했습니다!"); // 오류 시 메시지 출력
      }
    }
  };

  // 보상 삭제 클릭 시 삭제 모달 열기
  const handleDeleteClick = (reward) => {
    setRewardToDelete(reward); // 삭제할 보상 설정
    setIsDeleteOpen(true); // 삭제 모달 열기
  };

  // 구매 확인 모달 열기
  const handlePurchaseClick = (reward) => {
    if (reward.reward.rewardPoint > totalPoints) {
      toastDelete("포인트가 부족합니다!"); // 포인트 부족 시 메시지 출력
      return;
    }
    setRewardToPurchase(reward); // 구매할 보상 설정
    setIsConfirmOpen(true); // 구매 확인 모달 열기
  };

  // 구매 실행
  const handlePurchaseConfirm = async () => {
    if (rewardToPurchase) {
      try {
        await axios.post(
          `http://localhost:8089/wefam/rewards/${rewardToPurchase.reward.rewardIdx}/purchase`,
          null,
          {
            params: { userId },
          }
        );
        toastSuccess(`${rewardToPurchase.reward.rewardName}를 성공적으로 구매하였습니다!`); // 성공 메시지 출력
        fetchTotalPoints(); // 총 포인트 업데이트
        fetchRewards(); // 보상 목록 새로고침
        setIsConfirmOpen(false); // 구매 모달 닫기
        setRewardToPurchase(null); // 구매할 보상 초기화
      } catch (error) {
        toastDelete("구매에 실패했습니다!"); // 오류 시 메시지 출력
      }
    }
  };

  return (
    <div className="main">
      <div className={styles.container}>
        <div className={styles.titleGroup}>
          <div className={styles.leftTitleGroup}>
            <div className={styles.iconTitleGroup}>
              <div className={styles.icon}></div>
              <h1>포인트 상점</h1>
            </div>
            <div>
              <button className={styles.rewardPointButton} onClick={goToRewardPoint}>
                포인트 확인
              </button>
            </div>
          </div>
          <BsPlusCircle
            className={styles.btnAdd}
            onClick={() => {
              setSelectedReward(null); // 보상 초기화
              setIsModalOpen(true); // 추가 모달 열기
            }}
          />
        </div>

        <div className={styles.itemsContainer}>
          {rewards.map((rewardItem, index) => (
            <div key={index} className={styles.itemCard}>
              <div className={styles.cardHeader}>
                <BsThreeDots
                  className={styles.menuIcon}
                  onClick={() => toggleDropdown(index)} // 드롭다운 토글
                />
                {dropdownOpen === index && (
                  <div
                    className={styles.dropdownMenu}
                    ref={(el) => (dropdownRef.current[index] = el)} // 드롭다운 참조
                  >
                    <p onClick={() => handleEditReward(rewardItem)}>수정</p>
                    <p onClick={() => handleDeleteClick(rewardItem)}>삭제</p>
                  </div>
                )}
              </div>
              <img
                src={rewardItem.imageBase64}
                alt={rewardItem.reward.rewardName}
                className={styles.rewardImage}
              />
              <h2>{rewardItem.reward.rewardName}</h2>
              <div className={styles.pointGroup}>
                <p>
                  {rewardItem.reward.rewardPoint}
                  <img src={modalPointIcon} className={styles.Imgicon} />
                </p>
              </div>
              <div>
                <button onClick={() => handlePurchaseClick(rewardItem)} className={styles.buyButton}>
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
          onConfirm={handleDeleteConfirm} // 삭제 확인 시 실행
        />

        <ConfirmModal
          showModal={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)} // 모달 닫기
          onConfirm={handlePurchaseConfirm} // 구매 확인 시 실행
          message={`정말 ${rewardToPurchase?.reward.rewardName}을(를) 구매하시겠습니까?`} // 구매 확인 메시지
        />
      </div>
    </div>
  );
};

export default Reward;
