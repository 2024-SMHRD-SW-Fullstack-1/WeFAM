import React from "react";
import ReactDOM from "react-dom";
import modalStyles from "../../modal/Modal.module.css";

const RouletteModal = (feed, onClose, onSave) => {
  // 저장 버튼 클릭 시 피드 정보를 전달
  const handleSaveClick = () => {
    onSave({
      // 전달할 데이터
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
          <div>
            <span>작성자</span>
          </div>
          {/* 사용자 */}
          <div>
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

export default RouletteModal;
