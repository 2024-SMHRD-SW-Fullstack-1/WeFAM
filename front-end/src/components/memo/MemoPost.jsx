import React, { useState } from "react";

import styles from "./MemoPost.module.css";

import { BsCircle } from "react-icons/bs";
import { BsFillCircleFill } from "react-icons/bs";
import { BsPinAngle } from "react-icons/bs";
import { BsPinAngleFill } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";

const MemoPost = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isOptionVisible, setIsOptionVisible] = useState(false);
  const [writer, setWriter] = useState("F");
  const [title, setTitle] = useState("아들아 숙제다.");
  const [content, setContent] = useState("이번 주 안으로 롤 챌린저 찍기");
  const [updatedAt, setUpdatedAt] = useState("2024.08.23 오전 09:33");

  function check() {
    setIsChecked(!isChecked);
  }

  function fix() {
    setIsFixed(!isFixed);
  }

  function editMemo() {
    setIsOptionVisible(!isOptionVisible);
    alert("수정 클릭");
  }

  function deleteMemo() {
    setIsOptionVisible(!isOptionVisible);
    alert("삭제 클릭");
  }

  return (
    <div className={styles.memoPost}>
      <div className={styles.iconbar}>
        <button onClick={check}>
          {isChecked ? <BsFillCircleFill /> : <BsCircle />}
        </button>
        <span>
          <button onClick={fix}>
            {isFixed ? <BsPinAngleFill /> : <BsPinAngle />}
          </button>
          <button onClick={() => setIsOptionVisible(!isOptionVisible)}>
            <BsThreeDotsVertical />
          </button>
          {isOptionVisible ? (
            <ul className={styles.options}>
              <li>
                <button onClick={editMemo}>수정</button>
              </li>
              <li>
                <button onClick={deleteMemo}>삭제</button>
              </li>
            </ul>
          ) : null}
        </span>
      </div>
      <div className={styles.header}>
        <span className={styles.writer}>{writer}</span>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.content}>{content}</div>
      <div className={styles.updatedAt}>{updatedAt}</div>
    </div>
  );
};

export default MemoPost;
