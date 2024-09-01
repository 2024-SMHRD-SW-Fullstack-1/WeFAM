import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./FeedList.module.css";
import FeedDetailModal from "./FeedDetailModal";
import { BsSuitHeart, BsChatHeart, BsThreeDots } from "react-icons/bs";
import profileDefaultImage from "../../assets/images/profile-default-image.png";
import { elapsedTime } from "../../elapsedTime";

const FeedItem = ({ feed, onGetFeedDetail, onUpdateFeed, onDeleteFeed }) => {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null); // 선택된 이벤트 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 열림/닫힘 상태
  const optionsRef = useRef(null);

  // 옵션
  const toggleOptions = useCallback(() => {
    setIsOptionsVisible((prev) => !prev);
  }, []);
  const handleClickOutside = useCallback((e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      console.log("옵션 클릭");
      setIsOptionsVisible(false);
    }
  }, []);

  // 옵션창이 켜져있을 때
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

  // 피드 수정 클릭 시 모달을 열고 선택된 피드 저장
  const handleUpdateFeed = (feedIdx) => {
    console.log(`${feed.feedIdx}번 피드 수정 클릭`);
    // 피드 정보 모달에 보여주기 위해 저장
    setSelectedFeed({
      idx: feed.feedIdx,
    });
    setIsModalOpen(true);
  };

  const handleDeleteFeed = async (feedIdx) => {
    if (window.confirm(`${feedIdx}번 피드를 삭제하시겠습니까?`)) {
      // Feed 컴포넌트 -> FeedList 컴포넌트 -> FeedItem 컴포넌트
      await onDeleteFeed(feedIdx);
    }
  };

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

        <div
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
                  onClick={() => handleUpdateFeed(feed.feedIdx)}
                >
                  수정
                </button>
              </li>
              <li>
                <button
                  className="option"
                  onClick={() => handleDeleteFeed(feed.feedIdx)}
                >
                  삭제
                </button>
              </li>
            </ul>
          )}
        </div>
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

      {/* 모달이 열렸을 때만 FeedModal 컴포넌트 렌더링 */}
      {isModalOpen && (
        <FeedDetailModal
          feed={selectedFeed}
          onShow={onGetFeedDetail}
          onSave={onUpdateFeed}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default FeedItem;