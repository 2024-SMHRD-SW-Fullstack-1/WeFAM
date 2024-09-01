import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import modalStyles from "../modal/Modal.module.css";
import styles from "./FeedModal.module.css";
import axios from "axios"; // axios를 import

const FeedDetailModal = ({ feed, onShow, onClose, onSave }) => {
  // 부모 FeedItem에서 Feed는 받아지는 것을 확인 (feed 안에는 idx가 있음).
  // idx를 통해 db에서 피드 데이터 가져오기.

  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!feed || !feed.idx) {
        console.warn("Invalid feed or feed.idx");
        return;
      }

      try {
        // GET 요청을 보내어 feed 데이터를 가져오기.
        const response = await axios.get(
          `http://localhost:8089/wefam/get-feed-detail/${feed.idx}`
        );

        console.log("수정할 피드의 데이터 : ", response.data);

        // 응답 받은 데이터를 상태로 설정.
        setWriter(response.data.feedIdx);
        setContent(response.data.feedContent);
      } catch (error) {
        console.error("수정할 피드의 데이터 GET 요청 에러 :", error);
      } finally {
      }
    };
    fetchData();
  }, [feed, onShow]);

  // 저장 버튼 클릭하면 feed.idx와 content를 서버로 보내어 피드 업데이트.
  const handleSaveClick = () => {
    onSave(feed.idx, content);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className={modalStyles.modal} onClick={onClose}>
      <div
        className={modalStyles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* 작성자 필드 */}
          <div className={styles.field}>
            <span>{writer}</span>
          </div>
          {/* 사용자 */}
          <textarea
            className={styles.content}
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          {/* 모달 하단 버튼들 */}
          <div className={modalStyles.modalFooter}>
            <button className={modalStyles.cancelButton} onClick={onClose}>
              취소
            </button>
            <button
              className={modalStyles.saveButton}
              onClick={handleSaveClick}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body // 모달을 body에 추가
  );
};

export default FeedDetailModal;
