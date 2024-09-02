import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./FeedList.module.css";
import FeedDetailModal from "./FeedDetailModal";
import { BsSuitHeart, BsChatHeart, BsThreeDots } from "react-icons/bs";
import profileDefaultImage from "../../assets/images/profile-default-image.png";
import { elapsedTime } from "../../elapsedTime";

const FeedItem = ({ feed, onGetFeedDetail, onUpdateFeed, onDeleteFeed }) => {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null); // 선택된 이벤트 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 열림/닫힘 상태
  const [profileImg, setProfileImg] = useState(null); // 피드 작성자의 ID 상태 추가
  const [writerId, setWriterId] = useState(null); // 피드 작성자의 ID 상태 추가
  const optionsRef = useRef(null); // 옵션
  const textarea = useRef(null); // 댓글

  // 댓글 높이 자동 조절
  const handleResizeHeight = () => {
    textarea.current.style.height = "auto"; //height 초기화
    textarea.current.style.height = textarea.current.scrollHeight + "px";
  };

  // Redux store에서 현재 로그인한 사용자의 데이터를 가져오기.
  // -> 현재 사용자와 피드의 작성자 일치 여부로 옵션 창 내용 다르게 보여주기.
  const userData = useSelector((state) => state.user.userData);
  // 로그인한 사용자의 데이터 확인
  console.log("userData : ", userData);

  // 현재 사용자와 피드의 작성자가 일치하는 지 확인하기 위해 DB에서 피드 작성자 ID 가져오기
  const fetchWriterId = useCallback(async () => {
    try {
      // GET 요청을 보내어 feed 데이터를 가져오기.
      const response = await axios.get(
        `http://localhost:8089/wefam/get-feed-detail/${feed.feedIdx}`
      );
      console.log("피드 작성자 아이디 데이터 : ", response.data.userId);
      // 응답 받은 데이터를 상태로 설정.
      setWriterId(response.data.userId);
    } catch (error) {
      console.error("피드 작성자 아이디 요청 에러:", error);
    }
  }, [feed.feedIdx]);

  // 피드 작성자 ID를 통해 프로필 이미지 가져오기
  // setProfileImg();]
  // const fetchProfileImg = async() => {
  //   try {
  //     if (userData) {
  //       // 실제 사용자 데이터를 가져오는 axios 요청
  //       axios.get('http://localhost:8089/wefam/get-family')
  //         .then(response => {
  //           const loadedUsers = response.data.map(user => ({
  //             name: user.name,
  //             image: user.profileImg,
  //             online: true
  //           }));
  //           setUsers(loadedUsers);
  //         })
  //         .catch(error => {
  //           console.error("가져오기 에러!!", error);
  //         });
  //     } else {
  //       // 예시 사용자 데이터
  //       const exampleUsers = [
  //         { name: "원터", image: winter, online: true },
  //         { name: "카리나", image: karina, online: true },
  //         { name: "아이유", image: iu, online: false },
  //         { name: "마블리", image: madong, online: false }
  //       ];
  //       setUsers(exampleUsers);
  //     }
  //   } catch (error) {

  //   }
  // }

  // 옵션
  const toggleOptions = useCallback(() => {
    if (!isOptionsVisible) {
      fetchWriterId(); // 옵션이 처음 열릴 때만 작성자 아이디를 가져옴
    }
    setIsOptionsVisible((prev) => !prev);
  }, [isOptionsVisible, fetchWriterId]);

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
              {writerId === userData.id && (
                <>
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
                </>
              )}
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
          <textarea
            ref={textarea}
            rows="1"
            placeholder="댓글 달기..."
            onChange={handleResizeHeight}
          />
          <button className={styles.addCommentBtn}>댓글</button>
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
