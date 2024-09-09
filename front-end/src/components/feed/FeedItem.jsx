import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import styles from "./FeedItem.module.css";
import FeedDetailModal from "./FeedDetailModal";
import FeedEditModal from "./FeedEditModal";
import FeedComment from "./FeedComment";
import RouletteModal from "./RouletteModal";
import PollModal from "./PollModal";
import { elapsedTime } from "../../elapsedTime";
import { CiSquareCheck } from "react-icons/ci";
import { PiGameControllerLight } from "react-icons/pi";

import {
  BsSuitHeart,
  BsSuitHeartFill,
  BsChatHeart,
  BsThreeDots,
} from "react-icons/bs";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { PiArrowBendDownLeft } from "react-icons/pi";

const FeedItem = ({ feed, onGetFeedDetail, onUpdateFeed, onDeleteFeed }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [selectedRoulette, setSelectedRoulette] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRouletteModalOpen, setIsRouletteModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [writerProfileImg, setWriterProfileImg] = useState("");
  const [writerId, setWriterId] = useState("");
  const [writerNick, setWriterNick] = useState("");
  const [images, setImages] = useState([]);
  const imageMaxCount = 9;
  const imagePreCount = 3;
  const [currentSlide, setCurrentSlide] = useState(0);
  // 룰렛
  const [roulettes, setRoulettes] = useState([]);
  // 투표
  const [polls, setPolls] = useState([]);
  // 좋아요
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(feed.feedLikes || 0);
  // 댓글 개수
  const [cmtCount, setCmtCount] = useState(0);
  // 새로운 댓글
  const [newCmtContent, setNewCmtContent] = useState("");
  // 보여줄 댓글
  const [comments, setComments] = useState([]);

  // Refs
  const textarea = useRef(null); // 댓글 textarea
  const optionsRef = useRef(null); // 옵션 메뉴

  // 댓글 높이 자동 조절
  const handleResizeHeight = () => {
    if (textarea.current) {
      textarea.current.style.height = "auto"; // height 초기화
      textarea.current.style.height = textarea.current.scrollHeight + "px";
    }
  };

  // Redux store에서 현재 로그인한 사용자의 데이터를 가져오기
  const userData = useSelector((state) => state.user.userData);

  // 현재 사용자와 피드의 작성자가 일치하는지 확인하기 위해 DB에서 피드 작성자 ID 가져오기
  const fetchWriter = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8089/wefam/get-feed-detail/${feed.feedIdx}`
      );
      setWriterProfileImg(response.data.profileImg);
      setWriterId(response.data.userId);
      setWriterNick(response.data.nick);
    } catch (error) {
      console.error("피드 디테일 요청 에러:", error);
    }
  }, [feed.feedIdx]);

  // 피드에 관련된 이미지들을 가져오기
  const fetchImages = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8089/wefam/get-feed-img/${feed.feedIdx}`
      );
      setImages(response.data);
    } catch (error) {
      console.error(`피드 ${feed.feedIdx}번 이미지 요청 에러 :`, error);
    }
  }, [feed.feedIdx]);

  // getRoulettes를 useCallback으로 메모이제이션
  const getRoulettes = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8089/wefam/feed/${feed.feedIdx}/roulettes`
      );
      setRoulettes(Array.from(response.data));
    } catch (error) {
      console.error(`피드 ${feed.feedIdx}번 룰렛 요청 에러 :`, error);
    }
  }, [feed.feedIdx]);

  // getPolls를 useCallback으로 메모이제이션
  const getPolls = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8089/wefam/get-polls/${feed.feedIdx}`
      );
      setPolls(Array.from(response.data));
    } catch (error) {
      console.error(`피드 ${feed.feedIdx}번 투표 요청 에러 :`, error);
    }
  }, [feed.feedIdx]);

  const handlePrevSlide = (e) => {
    e.stopPropagation(); // 부모 요소로 이벤트 전파 방지
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleNextSlide = (e) => {
    e.stopPropagation(); // 부모 요소로 이벤트 전파 방지
    setCurrentSlide((prev) =>
      Math.min(prev + 1, Math.ceil(Math.min(images.length, 9) / 3) - 1)
    );
  };

  // 댓글 개수 가져오는 함수
  const countCmt = useCallback(async () => {
    try {
      // 현재 사용자가 좋아요를 눌렀는지 확인하는 API 호출 (옵션)
      // 예를 들어 현재 좋아요 상태를 가져오는 API가 있다면 사용
      const response = await axios.get(
        `http://localhost:8089/wefam/count-comments/${feed.feedIdx}`
      );
      setCmtCount(response.data);
    } catch (error) {
      console.error("Error fetching like status", error);
    }
  }, [feed.feedIdx]);

  // 댓글 가져오기
  const getAllCmts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8089/wefam/get-comments/${feed.feedIdx}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("댓글 가져오기 에러:", error);
    } finally {
      setIsLoading(false);
    }
  }, [feed.feedIdx]);

  useEffect(() => {
    fetchWriter();
    fetchImages();
    getRoulettes();
    getPolls();
  }, [fetchWriter, fetchImages, getRoulettes, getPolls]);

  useEffect(() => {
    getAllCmts();
  }, [getAllCmts]);

  // 댓글 삭제하여 리렌더링 시키기
  const handleDeleteCmt = (deletedCmtIdx) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.cmtIdx !== deletedCmtIdx)
    );
  };

  // 옵션
  const toggleOptions = useCallback(() => {
    if (!isOptionsVisible) {
      fetchWriter(); // 옵션이 처음 열릴 때만 작성자 아이디를 가져옴
    }
    setIsOptionsVisible((prev) => !prev);
  }, [isOptionsVisible, fetchWriter]);

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

  // 피드 클릭!
  const handleOpenFeed = () => {
    setSelectedFeed({ idx: feed.feedIdx });
    setIsDetailModalOpen(true);
  };

  // 피드 수정 클릭!
  const handleUpdateFeed = () => {
    setSelectedFeed({ idx: feed.feedIdx });
    setIsEditModalOpen(true);
  };

  // 피드 삭제 클릭!
  const handleDeleteFeed = async () => {
    if (window.confirm(`${feed.feedIdx}번 피드를 삭제하시겠습니까?`)) {
      await onDeleteFeed(feed.feedIdx);
    }
  };

  // 피드 룰렛 클릭!
  const handleOpenRoulette = (rouletteIdx) => {
    setSelectedFeed({ feedIdx: feed.feedIdx });
    setSelectedRoulette({ rouletteIdx }); // 선택된 rouletteIdx로 상태를 설정
    setIsRouletteModalOpen(true);
  };

  // 피드 투표 클릭!
  const handleOpenPoll = (pollIdx) => {
    setSelectedFeed({ feedIdx: feed.feedIdx });
    setSelectedPoll({ pollIdx }); // 선택된 pollIdx로 상태를 설정
    setIsPollModalOpen(true);
  };

  // 좋아요 누르기
  const handleHeart = async () => {
    try {
      await toggleLike();
    } catch (error) {
      console.error("좋아요 클릭 에러", error);
    }
  };

  // 좋아요를 체크하는 함수
  const checkLike = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8089/wefam/check-like",
        {
          params: {
            userId: userData.id,
            feedIdx: feed.feedIdx,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsLiked(response.data); // 응답 결과로 상태 초기화
    } catch (error) {
      console.error("Error checking like", error);
    }
  }, [feed.feedIdx]);

  useEffect(() => {
    countCmt();
    checkLike();
  }, [checkLike, countCmt]);

  // 좋아요를 토글하는 함수
  const toggleLike = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:8089/wefam/toggle-like",
        {
          userId: userData.id,
          feedIdx: feed.feedIdx,
        }
      );
      if (response.data) {
        // Liked
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        // Unliked
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error toggling like", error);
    }
  }, [feed.feedIdx]);

  // 새로운 댓글 작성 함수
  const addCmt = useCallback(async () => {
    try {
      setIsLoading(true);
      const newComment = {
        feedIdx: feed.feedIdx,
        userId: userData.id,
        cmtContent: newCmtContent,
      };
      await axios.post(
        "http://localhost:8089/wefam/add-feed-comment",
        newComment,
        {
          headers: {
            "Content-Type": "application/json", // 서버가 JSON 형식을 기대할 경우
          },
        }
      );
      setNewCmtContent(""); // 댓글 추가 후 상태 초기화
      getAllCmts(); // 댓글 추가 후 다시 가져오기
      countCmt();
    } catch (error) {
      console.error("댓글 추가 에러 : ", error);
    } finally {
      setIsLoading(false);
    }
  }, [feed.feedIdx, userData.id, newCmtContent, getAllCmts, countCmt]);

  // 현재 슬라이드 번호와 전체 슬라이드 수
  const currentSlideNumber = currentSlide + 1;
  const totalSlides = Math.ceil(Math.min(images.length, 9) / 3);
  return (
    <div className={styles.feedItem}>
      <div className={styles.header}>
        <div className={styles.feedInfoContainer}>
          <div className={styles.profileImg}>
            <img src={writerProfileImg} alt="Profile" />
          </div>

          <div className={styles.feedInfo}>
            <div className={styles.wrTime}>
              <span className={styles.writer}>{writerNick}</span>
              <span>ㆍ</span>
              <span className={styles.time}>{elapsedTime(feed.postedAt)}</span>
            </div>
            <div className={styles.location}>{feed.feedLocation}</div>
          </div>
        </div>

        {writerId === userData.id && (
          <div
            className={styles.feedOptionsContainer}
            onClick={toggleOptions}
            ref={optionsRef}
          >
            <BsThreeDots />
            {isOptionsVisible && (
              <ul className={styles.options}>
                <>
                  <li>
                    <button className="option" onClick={handleUpdateFeed}>
                      수정
                    </button>
                  </li>
                  <li>
                    <button className="option" onClick={handleDeleteFeed}>
                      삭제
                    </button>
                  </li>
                </>
              </ul>
            )}
          </div>
        )}
      </div>

      <div className={styles.content}>
        {/* 이미지 슬라이더 추가 */}
        {images.length > 0 && (
          <div className={styles.imageSlider}>
            <div className={styles.imageContainer} onClick={handleOpenFeed}>
              <button
                className={`${styles.leftArrowBtn} ${
                  currentSlide === 0 ? styles.hidden : ""
                }`}
                onClick={handlePrevSlide}
              >
                <MdKeyboardArrowLeft />
              </button>
              {images
                .slice(
                  currentSlide * imagePreCount,
                  (currentSlide + 1) * imagePreCount
                )
                .slice(0, imageMaxCount) // 최대 9개의 이미지만 표시
                .map((image, index) => (
                  <div key={index} className={styles.imageWrapper}>
                    <img
                      src={`data:image/jpeg;base64,${image.fileData}`}
                      alt={`feed-img-${index}`}
                    />
                  </div>
                ))}
              <button
                className={`${styles.rightArrowBtn} ${
                  currentSlide >=
                  Math.ceil(
                    Math.min(images.length, imageMaxCount) / imagePreCount
                  ) -
                    1
                    ? styles.hidden
                    : ""
                }`}
                onClick={handleNextSlide}
              >
                <MdKeyboardArrowRight />
              </button>
            </div>

            {/* 현재 이미지 번호와 전체 이미지 번호 표시 */}
            <div
              className={`${styles.slideNumber} ${
                totalSlides === 1 ? styles.hidden : ""
              }`}
            >
              {totalSlides > 1 && `${currentSlideNumber} / ${totalSlides}`}
            </div>
          </div>
        )}

        {/* 내용 - 룰렛 */}
        {roulettes.length > 0 ? (
          <div className={styles.roulettesContent}>
            <div className={styles.roulette}>
              {roulettes.map((roulette, index) => (
                <span key={index}>
                  <button
                    onClick={() => handleOpenRoulette(roulette.rouletteIdx)}
                  >
                    {" "}
                    <PiGameControllerLight />
                    <span>{roulette.rouletteTitle}</span>
                  </button>
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* 내용 - 투표 */}
        {polls.length > 0 ? (
          <div className={styles.pollsContent}>
            <div className={styles.poll}>
              {polls.map((poll, index) => (
                <span key={index}>
                  <button onClick={() => handleOpenPoll(poll.pollIdx)}>
                    {" "}
                    <CiSquareCheck />
                    <span>{poll.pollTitle}</span>
                  </button>
                </span>
              ))}
            </div>
          </div>
        ) : null}

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
            <button className={styles.likeBtn} onClick={handleHeart}>
              {isLiked ? (
                <BsSuitHeartFill style={{ color: "red" }} />
              ) : (
                <BsSuitHeart />
              )}
            </button>
            {likeCount || 0}
          </span>
          <span>
            {cmtCount > 0 ? (
              <BsChatHeart style={{ color: "red" }} />
            ) : (
              <BsChatHeart />
            )}
            {cmtCount || 0}
          </span>
        </div>
        <div className={styles.comment}>
          <textarea
            ref={textarea}
            rows="1"
            placeholder="댓글 달기..."
            value={newCmtContent} // 상태 값으로 textarea의 내용 설정
            onChange={(e) => setNewCmtContent(e.target.value)} // 댓글 내용 상태 업데이트
            onInput={handleResizeHeight}
          />
          <button
            className={styles.addCommentBtn}
            onClick={addCmt} // 버튼 클릭 시 addCmt 함수 호출
          >
            <PiArrowBendDownLeft />
          </button>
        </div>
        {comments.length > 0 ? (
          <ul className={styles.cmtContainer}>
            {comments.map((comment) => (
              <FeedComment
                key={comment.cmtIdx}
                comment={comment}
                onDeleteCmt={handleDeleteCmt}
              />
            ))}
          </ul>
        ) : null}
      </div>

      {isEditModalOpen && (
        <FeedEditModal
          feed={selectedFeed}
          onShow={onGetFeedDetail}
          onSave={onUpdateFeed}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isDetailModalOpen && (
        <FeedDetailModal
          feed={selectedFeed}
          onShow={onGetFeedDetail}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
      {isRouletteModalOpen && (
        <RouletteModal
          feed={selectedFeed}
          roulette={selectedRoulette}
          onShow={onGetFeedDetail}
          onClose={() => setIsRouletteModalOpen(false)}
        />
      )}
      {isPollModalOpen && (
        <PollModal
          feed={selectedFeed}
          poll={selectedPoll}
          onShow={onGetFeedDetail}
          onClose={() => setIsPollModalOpen(false)}
        />
      )}
    </div>
  );
};

export default FeedItem;
