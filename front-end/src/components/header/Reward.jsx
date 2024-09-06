import React, { useEffect, useState } from "react";
import styles from "./Reward.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import AddRewardModal from "./AddRewardModal";

const Reward = () => {
  const userData = useSelector((state) => state.user.userData);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [rewards, setRewards] = useState([]); // 보상 리스트 상태
  const [completedTasks, setCompletedTasks] = useState([]); // 완료된 작업들
  const [familyPoints, setFamilyPoints] = useState([]); // 가족 구성원 포인트 상태


  // 완료된 하우스워크 로그 가져오기
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8089/wefam/completed-works"
        );

        const completedTasksWithImages = response.data.map((item) => {
          return {
            ...item.workLog, // 작업 로그 데이터
            images: item.images, // 이미지 데이터
          };
        });

        setCompletedTasks(completedTasksWithImages); // 응답 데이터를 상태로 설정
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
        console.log(members.profileImg);

        // 각 구성원의 포인트 가져오기
        const pointsPromises = members.map((member) =>
          axios.get(`http://localhost:8089/wefam/get-total-points?userId=${member.userId}`)
        );

        const pointsResponses = await Promise.all(pointsPromises);
        const familyPointsData = members.map((member, index) => ({
          ...member,
          points: pointsResponses[index].data,
        }));

        setFamilyPoints(familyPointsData); // 구성원과 그들의 포인트를 상태에 저장
      } catch (error) {
        console.error("가족 구성원 포인트를 가져오는 중 오류 발생:", error);
      }
    };

    if (userData) {
      fetchFamilyPoints(); // 로그인된 유저 데이터가 있으면 실행
    }
  }, [userData]);


  const handleAddReward = (newReward) => {
    setRewards([...rewards, newReward]);
    // 추가된 보상을 서버로 전송하는 로직을 여기에 작성 가능
    // 예: axios.post('/wefam/add-reward', newReward);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="main">
      <div className={styles.container}>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          보상 추가
        </button>

        {/* 보상 아이템들을 보여주는 영역 */}
        <div className={styles.itemsContainer}>
          {rewards.map((reward, index) => (
            <div key={index} className={styles.itemCard}>
              <img
                src={reward.image}
                alt={reward.name}
                className={styles.rewardImage}
              />
              <h2>{reward.name}</h2>
              <p>{reward.points} Points</p>
            </div>
          ))}
        </div>

        {/* 완료된 작업들 표시 */}
        <div className={styles.logContainer}>
          <div className={styles.pointLog}>
            <h2>완료한 작업들</h2>
            <ul className={styles.completedTaskList}>
              {completedTasks.map((task, index) => (
                <li key={index} className={styles.completedTask}>
                  <h3>{task.workTitle}</h3>
                  <p>{task.workContent}</p>
                  <span>완료일: {formatDate(task.completedAt)}</span>
                  <span className={styles.taskPoints}>{task.points} 포인트</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 포인트 정보 및 가족 구성원 포인트 */}
          <div className={styles.point}>
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
                      <span>{member.points} 포인트</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 보상 추가 모달 */}
      <AddRewardModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onAddReward={handleAddReward}
      />
    </div>
  );
};

export default Reward;
