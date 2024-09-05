import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import styles from "./AddFeed.module.css";
import UploadImageModal from "./UploadImageModal";
import GameModal from "./game/GameModal";
import AddPollModal from "./AddPollModal";
import { PiArrowBendDownLeft } from "react-icons/pi";
import { CiImageOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { BsArchive } from "react-icons/bs";
import { PiGameControllerLight } from "react-icons/pi";
import { LuVote } from "react-icons/lu";
import { clearImages } from "../../features/imagesOnFeedSlice";
import { deletePoll, clearPolls } from "../../features/pollsSlice";
import Preloader from "../preloader/Preloader";

const AddFeed = React.memo(({ onGetAllFeeds }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [isUploadImageModalOpen, setIsUploadImageModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [polls, setPolls] = useState([]); // 투표 데이터 상태

  // Redux에서 로그인한 사용자 데이터 및 이미지를 가져오기
  const userData = useSelector((state) => state.user.userData);
  const pollsData = useSelector((state) => state.polls.polls) || [];

  const dispatch = useDispatch();
  // const images = useSelector((state) => state.imagesOnFeed.images);
  // console.log("images : ", images);

  useEffect(() => {
    // 페이지 로드 시 이미지 상태를 초기화
    // dispatch(clearImages());
    dispatch(clearPolls()); // 페이지 로드 시 polls 상태를 초기화
  }, [dispatch]);

  useEffect(() => {
    setPolls(pollsData); // Redux에서 가져온 polls를 상태에 설정
  }, [pollsData]);

  // const handlePrev = () => {
  //   if (currentIndex > 0) {
  //     setCurrentIndex(currentIndex - 1);
  //   }
  // };

  // const handleNext = () => {
  //   if (currentIndex + 5 < images.length) {
  //     setCurrentIndex(currentIndex + 1);
  //   }
  // };

  // 새로운 피드 작성 함수
  const addFeed = useCallback(
    async (newFeed) => {
      try {
        console.log("addFeed 함수 실행 ");
        setIsLoading(true);
        await axios.post("http://localhost:8089/wefam/add-feed", newFeed, {
          headers: {
            "Content-Type": "application/json", // 서버가 JSON 형식을 기대할 경우
          },
        });
        await onGetAllFeeds(userData.familyIdx);
      } catch (error) {
        console.error("addFeed 함수 에러 : ", error);
      } finally {
        setIsLoading(false);
      }
    },
    [userData.familyIdx, onGetAllFeeds]
  );

  const handleAddFeed = async () => {
    if (content.trim() === "") {
      alert("내용을 입력하세요.");
      return;
    }
    try {
      const newFeed = {
        familyIdx: userData.familyIdx,
        userId: userData.id,
        feedContent: content,
        feedLocation: location,
      };

      // pollsContent가 비어 있지 않은 경우에만 polls 추가
      if (polls.length > 0) {
        newFeed.polls = polls;
      }
      console.log(newFeed);
      await addFeed(newFeed);
      setContent("");
      setLocation("");
      setPolls([]); // 피드를 추가한 후 투표 내용도 초기화
      dispatch(clearPolls()); // 리덕스의 polls 상태 초기화
    } catch (error) {
      console.error("AddFeed 함수에서 오류 발생:", error);
    }
  };

  // PollModal에서 저장된 투표 데이터를 받아서 상태에 저장
  const handlePollSave = (pollData) => {
    setPolls([...polls, pollData]);
  };

  const handleDeletePoll = (pollId) => {
    dispatch(deletePoll({ pollId }));
  };

  return (
    <div className={styles.addFeed}>
      {isLoading ? (
        <Preloader isLoading={isLoading} />
      ) : (
        <>
          <textarea
            className={styles.content}
            placeholder="무슨 생각을 하고 계신가요?"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <div className={styles.imagesContent}></div>
          {polls.length > 0 ? (
            <div className={styles.pollsContent}>
              {polls.map((poll, index) => (
                <div key={index} className={styles.poll}>
                  <button>
                    <LuVote />
                    <span>{poll.title}</span>
                  </button>
                  <button onClick={() => handleDeletePoll(poll.id)}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <hr className={styles.customHr}></hr>
          <div className={styles.footer}>
            <span>
              <button onClick={() => setIsUploadImageModalOpen(true)}>
                <CiImageOn />
              </button>
              <button>
                <CiCalendar />
              </button>
              <button onClick={() => setIsGameModalOpen(true)}>
                <PiGameControllerLight />
              </button>
              <button onClick={() => setIsPollModalOpen(true)}>
                <BsArchive />
              </button>
            </span>
            <span>
              <button className={styles.addFeedBtn} onClick={handleAddFeed}>
                <PiArrowBendDownLeft />
              </button>
            </span>
          </div>
          {isUploadImageModalOpen && (
            <UploadImageModal
              content={content}
              onHandleAddFeed={handleAddFeed}
              onGetAllFeeds={onGetAllFeeds}
              onClose={() => setIsUploadImageModalOpen(false)}
            />
          )}
          {isGameModalOpen && (
            <GameModal onClose={() => setIsGameModalOpen(false)} />
          )}
          {isPollModalOpen && (
            <AddPollModal
              onSavePoll={handlePollSave}
              onClose={() => setIsPollModalOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
});

export default AddFeed;
