import React, { useState } from "react";
import styles from "./AddFeed.module.css";
import { BsArrowReturnLeft } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { BsArchive } from "react-icons/bs";
import { PiGameControllerLight } from "react-icons/pi";
import axios from "axios";

const AddFeed = ({ onAddFeed }) => {
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");

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
    setContent(""); // 입력 필드 초기화
    setLocation("");
  };

  return (
    <div className={styles.addFeed}>
      <textarea
        className={styles.content}
        placeholder="무슨 생각을 하고 계신가요?"
        name="content"
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
          <button>
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
    </div>
  );
};

export default AddFeed;
