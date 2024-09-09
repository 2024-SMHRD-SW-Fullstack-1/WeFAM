import React, { useEffect, useState } from "react";
import styles from "./RewardPoint.module.css";
import axios from "axios";
import { useSelector } from "react-redux";

const RewardPoint = () => {
  const userData = useSelector((state) => state.user.userData);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [familyPoints, setFamilyPoints] = useState([]);
  const [purchasedRewards, setPurchasedRewards] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0); // 유저의 총 포인트 상태

  // 완료된 하우스워크 로그 가져오기
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8089/wefam/completed-user-works?userId=${userData.id}`
        );
        const completedTasksWithImages = response.data.map((item) => {
          return {
            ...item.workLog,
            images: item.images,
          };
        });

        setCompletedTasks(completedTasksWithImages);
      } catch (error) {
        console.error("완료된 작업을 가져오는 중 오류 발생:", error);
      }
    };

    if (userData) {
      fetchCompletedTasks();
    }
  }, [userData]);

  // 가족 구성원 포인트 가져오기
  useEffect(() => {
    const fetchFamilyPoints = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8089/wefam/get-family-members/${userData.id}`
        );
        const members = response.data;

        const userDataPromises = members.map((member) =>
          axios.get(
            `http://localhost:8089/wefam/get-user-data?userId=${member.userId}`
          )
        );

        const userDataResponses = await Promise.all(userDataPromises);
        const familyPointsData = userDataResponses.map(
          (response) => response.data
        );

        setFamilyPoints(familyPointsData);
      } catch (error) {
        console.error("가족 구성원 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    if (userData) {
      fetchFamilyPoints();
    }
  }, [userData, totalPoints]); // totalPoints가 변경되면 다시 데이터를 가져옴

  // 유저 총 포인트 불러오기
  useEffect(() => {
    const fetchTotalPoints = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8089/wefam/get-user-data?userId=${userData.id}`
        );
        setTotalPoints(response.data.points); // 유저 총 포인트 상태 설정
      } catch (error) {
        console.error("포인트 정보를 가져오는 중 오류 발생:", error);
      }
    };

    if (userData) {
      fetchTotalPoints();
    }
  }, [userData]);

  // 구매한 보상 가져오기
  useEffect(() => {
    const fetchPurchasedRewards = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8089/wefam/rewards/purchased/${userData.id}`
        );
        setPurchasedRewards(response.data);
      } catch (error) {
        console.error("구매한 보상을 가져오는 중 오류 발생:", error);
      }
    };

    if (userData) {
      fetchPurchasedRewards();
    }
  }, [userData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="main">
      <div style={{
        backgroundColor: "#ffffff",
        marginTop: "2rem",
        borderRadius: "1rem",
        padding: "1rem",
        height: "710px",
      }}>
        {/* 완료된 작업들 표시 */}
        <div className={styles.logContainer}>
          <div className={styles.pointLog}>
            <h2>완료한 작업들</h2>
            <ul className={styles.completedTaskList}>
              {completedTasks.map((task, index) => (
                <li key={index} className={styles.completedTask}>
                  <div className={styles.completedTaskContent}>
                    <h3>{task.workTitle}</h3>
                    <p>{task.workContent}</p>
                  </div>
                  <div className={styles.completedTaskDetails}>
                    <span>완료일: {formatDate(task.completedAt)}</span>
                    <span className={styles.taskPoints}>
                      {task.points} 포인트
                    </span>
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
                    src={rewardItem.imageBase64}
                    alt={rewardItem.reward.rewardName}
                    className={styles.rewardImage}
                  />
                  <div className={styles.rewardDetails}>
                    <h3>{rewardItem.reward.rewardName}</h3>
                    <p>{rewardItem.reward.rewardPoint} Points</p>
                    <span>
                      구매일:{" "}
                      {new Date(rewardItem.reward.soldAt).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 가족 구성원 포인트 */}
          <div className={styles.familyPointsContainer}>
            <h2>가족 구성원 포인트</h2>
            <ul>
              {familyPoints.map((member) => (
                <li key={member.userId} className={styles.familyMember}>
                  <img
                    src={member.profileImg || "default_profile_image_url"}
                    alt={member.name}
                    className={styles.familyMemberImg}
                  />
                  <div className={styles.memberInfo}>
                    <span>{member.name}</span>
                    <span>{member.points} 포인트</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div >
  );
};

export default RewardPoint;
