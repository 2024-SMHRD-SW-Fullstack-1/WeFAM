import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./FeedList.module.css";
import { BsSuitHeart, BsChatHeart, BsThreeDots } from "react-icons/bs";
import profileDefaultImage from "../../assets/images/profile-default-image.png";
import { elapsedTime } from "../../elapsedTime";

const FeedItem = ({ feed, onUpdate, onDelete }) => {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const optionsRef = useRef(null);

  const toggleOptions = useCallback(() => {
    setIsOptionsVisible((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback((e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      setIsOptionsVisible(false);
    }
  }, []);

  useEffect(() => {
    if (isOptionsVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOptionsVisible, handleClickOutside]);

  return (
    <div className={styles.feedItem}>
      {console.log(`${feed.feedIdx}번 피드 렌더링`)}
      <div className={styles.header}>
        <div className={styles.feedInfoContainer}>
          <div className={styles.profileImg}>
            <img src={profileDefaultImage} alt="Profile" />
          </div>
          <div className={styles.feedInfo}>
            <div className={styles.wrTime}>
              <span className={styles.writer}>{feed.id}</span>
              <span>ㆍ</span>
              <span className={styles.time}>{elapsedTime(feed.postedAt)}</span>
            </div>
            <div className={styles.location}>{feed.feedLocation}</div>
          </div>
        </div>

        <button
          className={styles.feedOptionsContainer}
          onClick={toggleOptions}
          ref={optionsRef}
        >
          <BsThreeDots />
          {isOptionsVisible && (
            <ul className={styles.options}>
              <li>
                <button
                  className="option"
                  onClick={() => onUpdate(feed.feedIdx)}
                >
                  수정
                </button>
              </li>
              <li>
                <button
                  className="option"
                  onClick={() => onDelete(feed.feedIdx)}
                >
                  삭제
                </button>
              </li>
            </ul>
          )}
        </button>
      </div>

      <div className={styles.content}>
        {(() => {
          let content;
          switch (feed.feedType) {
            case "event":
              content = "일정이 등록되었습니다.";
              break;
            case "mission":
              content = "미션이 등록되었습니다.";
              break;
            default:
              content = feed.feedContent;
          }
          return content;
        })()}
      </div>

      <div className={styles.footer}>
        <div className={styles.iconbar}>
          <span>
            <BsSuitHeart />
            {feed.feedLikes || 0}
          </span>
          <span>
            <BsChatHeart />0
          </span>
        </div>
        <div className={styles.comment}>
          <textarea rows="1" placeholder="댓글 달기..." />
          <button>게시</button>
        </div>
      </div>
    </div>
  );
};

export default FeedItem;
