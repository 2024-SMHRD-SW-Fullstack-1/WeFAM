import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import modalStyles from "../modal/Modal.module.css";
import styles from "./FeedModal.module.css";

const FeedModal = ({ feed, onClose, onSave }) => {
  // 저장 버튼 클릭 시 피드 정보를 전달
  const handleSaveClick = () => {
    onSave({
      idx: feed.feedIdx, // ID도 함께 전달
    });
  };

  return ReactDOM.createPortal(
    <div className={modalStyles.modal} onClick={onClose}>
      <div
        className={modalStyles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* 작성자, 그룹, 코알 필드 */}
          <div className={styles.field}>
            <span>작성자</span>
          </div>
          {/* 사용자 */}
          <div className={styles.field}>
            <span>그룹</span>
          </div>
          {/* 모달 하단 버튼들 */}
          <div className={modalStyles.modalFooter}>
            <button className={modalStyles.cancelButton} onClick={onClose}>
              취소
            </button>
            <button className={modalStyles.saveButton} onClick={onSave}>
              저장
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body // 모달을 body에 추가
  );
};

export default FeedModal;
