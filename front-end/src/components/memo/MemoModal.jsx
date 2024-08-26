import React, { useState } from "react";
import axios from "axios";
import styles from "./MemoModal.module.css";

const MemoModal = ({ onClose }) => {
  const [memoWriter, setMemoWriter] = useState("F");
  const [memoTitle, setMemoTitle] = useState("아들아 숙제다.");
  const [memoContent, setMemoContent] =
    useState("이번 주 안으로 롤 챌린저 찍기");

  function addMemo() {
    return axios
      .post("http://localhost:8089/wefam/add-memo", {
        groupIdx: "jfam",
        userId: "jgod",
        memoTitle: memoTitle,
        memoContent: memoContent,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  return (
    <div className={styles.modal}>
      <div className={styles["modal-content"]}>
        <div className={styles.memoPost}>
          <div className={styles.header}>
            <span
              className={styles.writer}
              name="memoWriter"
              value={memoWriter}
            ></span>
            <input
              className={styles.title}
              placeholder="제목을 입력하세요 :)"
              name="memoTitle"
              value={memoTitle}
              onChange={(e) => setMemoTitle(e.target.value)}
            ></input>
          </div>
          <textarea
            className={styles.content}
            placeholder="내용을 입력하세요 :)"
            name="memoContent"
            value={memoContent}
            onChange={(e) => setMemoContent(e.target.value)}
          ></textarea>
          {/* 모달 하단 버튼들 */}
          <div className={styles.modalFooter}>
            <button className="cancelButton" onClick={onClose}>
              취소
            </button>
            <button className="saveButton" onClick={addMemo}>
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoModal;
