import React from "react";
import { useState } from "react";
import Modal from "react-modal";
import styles from "./Memo.module.css";
import MemoPost from "./MemoPost.jsx";

import { BsTrash } from "react-icons/bs";
import { BsPlusCircle } from "react-icons/bs";
import MemoModal from "./MemoModal.jsx";

// Modal의 root element를 설정합니다.
Modal.setAppElement("#root");

const Memo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function deleteMemo() {}

  function addMemo() {
    setIsModalOpen(true);
    alert("클릭");
  }
  function closeMemo() {
    setIsModalOpen(false);
  }

  return (
    <div className="main">
      <div className={styles.subHeader}>
        <h1>그룹명 메모장</h1>
        <span>
          <button>
            <BsTrash />
          </button>
          <button onClick={addMemo}>
            <BsPlusCircle />
          </button>
        </span>
      </div>
      <span>memos</span>
      {isModalOpen && <MemoModal onClose={() => setIsModalOpen(false)} />}
      <MemoPost></MemoPost>
    </div>
  );
};

export default Memo;
