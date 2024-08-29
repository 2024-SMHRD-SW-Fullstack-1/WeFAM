import React, { useState } from "react";
import styles from "./AddFeed.module.css";
import RouletteModal from "./game/RouletteModal";
import { BsArrowReturnLeft } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { BsArchive } from "react-icons/bs";
import { PiGameControllerLight } from "react-icons/pi";
import axios from "axios";

const AddFeed = React.memo(({ onAddFeed }) => {
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");

  const [isGameModalOpen, setIsGameModalOpen] = useState(false); // 모달 창 열림/닫힘 상태

  // 새로운 피드 작성 클릭
  const handleAddFeed = async () => {
    if (content.trim() === "") {
      // 경고창을 띄워서 내용을 입력하게 하자
      alert("내용을 입력하세요.");
      return;
    }
    const newFeed = {
      familyIdx: 1, // 필요한 경우, 실제 데이터로 수정
      id: "jgod", // 필요한 경우, 실제 데이터로 수정
      feedContent: content,
      feedLocation: location,
    };
    await onAddFeed(newFeed); // 상위 컴포넌트의 함수 호출
    setContent("");
    setLocation("");
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
          <button onClick={handleAddFeed}>
            <BsArrowReturnLeft />
          </button>
        </span>
      </div>

      {/* 모달이 열렸을 때만 RouletteModal 컴포넌트 렌더링 */}
      {isGameModalOpen && (
        <RouletteModal onClose={() => setIsGameModalOpen(false)} />
      )}
    </div>
  );
});

export default AddFeed;
