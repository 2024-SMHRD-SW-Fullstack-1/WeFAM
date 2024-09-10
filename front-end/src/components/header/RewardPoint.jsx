import React, { useEffect, useState } from "react";
import styles from "./RewardPoint.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import modalPointIcon from "../../assets/images/modalPointIcon.png";

const RewardPoint = () => {
  const userData = useSelector((state) => state.user.userData);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [purchasedRewards, setPurchasedRewards] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  // 완료된 하우스워크 로그 가져오기
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8089/wefam/completed-user-works?userId=${userData.id}`
        );
        const completedTasksWithImages = response.data.map((item) => ({
          ...item.workLog,
          images: item.images,
        }));

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
    const fetchFamilyMembers = async () => {
      try {
        const familyResponse = await axios.get("http://localhost:8089/wefam/get-family");
        const members = familyResponse.data;

        const memberPointPromises = members.map(async (member) => {
          const userResponse = await axios.get(
            `http://localhost:8089/wefam/get-user-data?userId=${member.id}`
          );
          return {
            ...member,
            points: userResponse.data.points,
          };
        });

        const familyMembersWithPoints = await Promise.all(memberPointPromises);

        const sortedMembers = familyMembersWithPoints.sort((a, b) =>
          a.id === userData.id ? -1 : b.id === userData.id ? 1 : 0
        );

        setFamilyMembers(sortedMembers);
      } catch (error) {
        console.error("가족 구성원 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchFamilyMembers();
  }, [userData]);

  // 유저 총 포인트 불러오기
  useEffect(() => {
    const fetchTotalPoints = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8089/wefam/get-user-data?userId=${userData.id}`
        );
        setTotalPoints(response.data.points);
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
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
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
                      {task.points}
                      <img src={modalPointIcon} className={styles.Imgicon} />
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
                    <p>
                      {rewardItem.reward.rewardPoint}
                      <img src={modalPointIcon} className={styles.Imgicon} />
                    </p>
                    <span>
                      구매일: {new Date(rewardItem.reward.soldAt).toLocaleDateString()}
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
              {familyMembers.map((member) => (
                <li key={member.id} className={styles.familyMember}>
                  <img
                    src={member.profileImg || "default_profile_image_url"}
                    alt={member.name}
                    className={styles.familyMemberImg}
                  />
                  <div className={styles.memberInfo}>
                    <span style={{ flexGrow: 1 }}>{member.name}</span>
                    <span style={{ marginLeft: "auto" }}>
                      {member.points}
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
