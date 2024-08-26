import React, { useEffect, useState } from "react";
import styles from "./FeedDetail.module.css";

import winter from "../../assets/images/winter.png";
import { BsSuitHeart } from "react-icons/bs";
import { BsChatHeart } from "react-icons/bs";

const FeedDetail = () => {
  const [profileImg, setProfileImg] = useState("");
  const [writer, setWriter] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [hrtCount, setHrtCount] = useState(0);
  const [cmtCount, setCmtCount] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className={styles.feedDetail}>
      <div className={styles.header}>
        <div className={styles.profileImg}>
          <img src={profileImg} />
        </div>
        <div className={styles.info}>
          <div>
            <span className={styles.writer}>{writer}</span>
            <span>ㆍ</span>
            <span className={styles.time}>{time}</span>
          </div>
          <div className={styles.location}>{location}</div>
        </div>
      </div>

      {<div className={styles.type}>피드타입</div>}

      <div className={styles.content}>피드내용</div>

      <div className={styles.footer}>
        <div className={styles.iconbar}>
          <span>
            <BsSuitHeart />
            {hrtCount}
          </span>
          <span>
            <BsChatHeart />
            {cmtCount}
          </span>
        </div>
        <div className={styles.comment}>
          <textarea
            rows="1"
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글 달기..."
          />
          {content === "" ? null : <button>게시</button>}
        </div>
      </div>
    </div>
  );
};

export default FeedDetail;
