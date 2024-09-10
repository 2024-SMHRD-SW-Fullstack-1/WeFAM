import React, { useEffect, useState } from "react";
import styles from "./RewardPoint.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import modalPointIcon from "../../assets/images/modalPointIcon.png";
import { toastSuccess, toastDelete } from "../Toast/showCustomToast";


const RewardPoint = () => {
  const userData = useSelector((state) => state.user.userData);  // Redux에서 로그인한 사용자 정보 가져옴
  const [completedTasks, setCompletedTasks] = useState([]);  // 완료된 작업 목록 상태
  const [familyMembers, setFamilyMembers] = useState([]);  // 가족 구성원 정보 상태
  const [purchasedRewards, setPurchasedRewards] = useState([]);  // 구매한 보상 목록 상태
  const [totalPoints, setTotalPoints] = useState(0);  // 총 포인트 상태

  // 완료된 하우스워크 로그 가져오기
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8089/wefam/completed-user-works?userId=${userData.id}`  // 완료된 작업 API 호출
        );
        const completedTasksWithImages = response.data.map((item) => ({
          ...item.workLog,
          images: item.images,  // 작업 로그와 이미지 데이터를 합침
        }));

        setCompletedTasks(completedTasksWithImages);  // 완료된 작업 상태 업데이트
      } catch (error) {
        toastDelete("항목을 불러오는데 실패했습니다!");  // 오류 시 사용자에게 토스트 메시지 표시
      }
    };

    if (userData) {
      fetchCompletedTasks();  // 유저 데이터가 있을 경우 완료된 작업 불러오기
    }
  }, [userData]);

  // 가족 구성원 포인트 가져오기
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const familyResponse = await axios.get("http://localhost:8089/wefam/get-family");  // 가족 구성원 API 호출
        const members = familyResponse.data;

        const memberPointPromises = members.map(async (member) => {
          const userResponse = await axios.get(
            `http://localhost:8089/wefam/get-user-data?userId=${member.id}`  // 개별 구성원의 포인트 데이터 호출
          );
          return {
            ...member,
            points: userResponse.data.points,  // 가족 구성원 정보에 포인트 추가
          };
        });

        const familyMembersWithPoints = await Promise.all(memberPointPromises);  // 비동기 호출이 완료될 때까지 기다림

        const sortedMembers = familyMembersWithPoints.sort((a, b) =>
          a.id === userData.id ? -1 : b.id === userData.id ? 1 : 0  // 현재 로그인한 사용자를 맨 위로 배치
        );

        setFamilyMembers(sortedMembers);  // 가족 구성원 목록 상태 업데이트
      } catch (error) {
        toastDelete("가족 구성원을 불러오는데 실패했습니다!");  // 오류 시 사용자에게 토스트 메시지 표시
      }
    };

    fetchFamilyMembers();  // 가족 구성원 데이터 호출
  }, [userData]);

  // 유저 총 포인트 불러오기
  useEffect(() => {
    const fetchTotalPoints = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8089/wefam/get-user-data?userId=${userData.id}`  // 총 포인트 API 호출
        );
        setTotalPoints(response.data.points);  // 포인트 상태 업데이트
      } catch (error) {
        toastDelete("포인트 정보를 불러오는데 실패했습니다!");  // 오류 시 사용자에게 토스트 메시지 표시
      }
    };

    if (userData) {
      fetchTotalPoints();  // 유저 데이터가 있을 경우 총 포인트 불러오기
    }
  }, [userData]);

  // 구매한 보상 가져오기
  useEffect(() => {
    const fetchPurchasedRewards = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8089/wefam/rewards/purchased/${userData.id}`  // 구매한 보상 API 호출
        );
        setPurchasedRewards(response.data);  // 구매한 보상 상태 업데이트
      } catch (error) {
        toastDelete("구매한 상품을 불러오는데 실패했습니다!");  // 오류 시 사용자에게 토스트 메시지 표시
      }
    };

    if (userData) {
      fetchPurchasedRewards();  // 유저 데이터가 있을 경우 구매한 보상 불러오기
    }
  }, [userData]);

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;  // 'YYYY-MM-DD' 형식으로 변환
  };

  return (
    <div className="main">
      <div
        style={{
          backgroundColor: "#ffffff",
          marginTop: "2rem",
          borderRadius: "1rem",
          padding: "1rem",
          height: "710px",
        }}
      >
        {/* 완료된 작업들 표시 */}
        <div className={styles.logContainer}>
          <div className={styles.pointLog}>
            <h2>내가 한 일</h2>
            <ul className={styles.completedTaskList}>
              {completedTasks.map((task, index) => (
                <li key={index} className={styles.completedTask}>

                  <div className={styles.completedTaskContent}>
                    <h3>{task.workTitle}</h3>
                    <p className={styles.taskPoints}>
                      {task.points}
                      <img src={modalPointIcon} className={styles.Imgicon} />
                    </p>
                    <span>완료일: {formatDate(task.completedAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 구매 내역 */}
          <div className={styles.buyContainer}>
            <h2>구매 내역</h2>
            <ul className={styles.purchasedRewardsList}>
              {purchasedRewards.map((rewardItem, index) => (
                <li key={index} className={styles.purchasedReward}>
                  <img
                    src={rewardItem.imageBase64}  // 보상 이미지 표시
                    alt={rewardItem.reward.rewardName}  // 보상 이름 표시
                    className={styles.rewardImage}
                  />
                  <div className={styles.rewardDetails}>
                    <h3>{rewardItem.reward.rewardName}</h3>  {/* 보상 이름 */}
                    <p className={styles.taskPoints}>
                      {rewardItem.reward.rewardPoint}  {/* 보상 포인트 */}
                      <img src={modalPointIcon} className={styles.Imgicon} />
                    </p>
                    <span>
                      구매일: {new Date(rewardItem.reward.soldAt).toLocaleDateString()}  {/* 구매 날짜 */}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 가족 구성원 포인트 */}
          <div className={styles.familyPointsContainer}>
            <h2>보유 포인트 현황</h2>
            <ul>
              {familyMembers.map((member) => (
                <li key={member.id} className={styles.familyMember}>
                  <img
                    src={member.profileImg || "default_profile_image_url"}  // 프로필 이미지가 없을 경우 기본 이미지 사용
                    alt={member.name}
                    className={styles.familyMemberImg}
                  />
                  <div className={styles.memberInfo}>
                    <span style={{ flexGrow: 1 }}>{member.name}</span>
                    <span style={{ marginLeft: "auto" }}>
                      {member.points}  {/* 가족 구성원 포인트 */}
                      <img src={modalPointIcon} className={styles.Imgicon} />
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardPoint;
