import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./AddFeed.module.css";
import UploadImageModal from "./UploadImageModal";
import GameModal from "./game/GameModal";
import { PiArrowBendDownLeft } from "react-icons/pi";
import { CiImageOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { BsArchive } from "react-icons/bs";
import { PiGameControllerLight } from "react-icons/pi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { clearImages } from "../../features/imagesOnFeedSlice";

const AddFeed = React.memo(({ onAddFeed, onGetJoiningData, onGetAllFeeds }) => {
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [isUploadImageModalOpen, setIsUploadImageModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Redux에서 로그인한 사용자 데이터 및 이미지를 가져오기
  const userData = useSelector((state) => state.user.userData);
  const images = useSelector((state) => state.imagesOnFeed.images);
  console.log("images : ", images);
  const dispatch = useDispatch();
  useEffect(() => {
    // 페이지 로드 시 이미지 상태를 초기화
    dispatch(clearImages());
  }, [dispatch]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 5 < images.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleAddFeed = async () => {
    if (content.trim() === "") {
      alert("내용을 입력하세요.");
      return;
    }
    try {
      const joiningData = await onGetJoiningData(userData.id);
      const newFeed = {
        familyIdx: joiningData.familyIdx,
        userId: userData.id,
        feedContent: content,
        feedLocation: location,
      };

      await onAddFeed(newFeed);
      setContent("");
      setLocation("");
    } catch (error) {
      console.error("AddFeed 함수에서 오류 발생:", error);
    }
  };

  return (
    <div className={styles.addFeed}>
      <textarea
        className={styles.content}
        placeholder="무슨 생각을 하고 계신가요?"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
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
          <button>
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
          onGetJoiningData={onGetJoiningData}
          onGetAllFeeds={onGetAllFeeds}
          onClose={() => setIsUploadImageModalOpen(false)}
        />
      )}

      {isGameModalOpen && (
        <GameModal onClose={() => setIsGameModalOpen(false)} />
      )}
    </div>
  );
});

export default AddFeed;
