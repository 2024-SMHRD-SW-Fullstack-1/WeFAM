import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./AddFeed.module.css";
import GameModal from "./game/GameModal";
import { PiArrowBendDownLeft } from "react-icons/pi";
import { CiImageOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { BsArchive } from "react-icons/bs";
import { PiGameControllerLight } from "react-icons/pi";

const AddFeed = React.memo(({ onAddFeed, onGetJoiningData }) => {
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");

  const [isGameModalOpen, setIsGameModalOpen] = useState(false); // 모달 창 열림/닫힘 상태

  // Redux store에서 현재 로그인한 사용자의 데이터를 가져오기.
  // 이 데이터는 state.user.userData에 저장되어 있음.
  const userData = useSelector((state) => state.user.userData);
  // 로그인한 사용자의 데이터 확인
  console.log("AddFeed 리렌더링 중");

  // 새로운 피드 작성 클릭
  const handleAddFeed = async () => {
    if (content.trim() === "") {
      // 경고창을 띄워서 내용을 입력하게 하자
      alert("내용을 입력하세요.");
      return;
    }
    try {
      const joiningData = await onGetJoiningData(userData.id);
      const newFeed = {
        familyIdx: joiningData.familyIdx,
        userId: userData.id,
        feedContent: content,
        feedLocation: location,
      };

      await onAddFeed(newFeed); // 상위 컴포넌트의 함수 호출
      setContent("");
      setLocation("");
    } catch (error) {
      console.error("AddFeed 함수에서 오류 발생:", error);
    }
  };
  return (
    <div className={styles.addFeed}>
      <textarea
        className={styles.content}
        placeholder="무슨 생각을 하고 계신가요?"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <hr className={styles.customHr}></hr>
      <div className={styles.footer}>
        <span>
          <button>
            <CiImageOn />
          </button>
          <button>
            <CiCalendar />
          </button>
          <button onClick={() => setIsGameModalOpen(true)}>
            <PiGameControllerLight />
          </button>
          <button>
            <BsArchive />
          </button>
        </span>
        <span>
          <button className={styles.addFeedBtn} onClick={handleAddFeed}>
            <PiArrowBendDownLeft />
          </button>
        </span>
      </div>

      {/* 모달이 열렸을 때만 RouletteModal 컴포넌트 렌더링 */}
      {isGameModalOpen && (
        <GameModal onClose={() => setIsGameModalOpen(false)} />
      )}
    </div>
  );
});

export default AddFeed;
