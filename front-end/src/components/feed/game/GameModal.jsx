import React from "react";
import ReactDOM from "react-dom";
import modalStyles from "../../modal/Modal.module.css";

const GameModal = () => {
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
          <button>
            <img src="" />
            <span>룰렛</span>
          </button>
          <button>
            <img src="" />
            <span>사다리타기</span>
          </button>
        </div>
        {/* 모달 하단 버튼들 */}
        <div className={modalStyles.modalFooter}>
          <button className={modalStyles.cancelButton} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>,
    document.body // 모달을 body에 추가
  );
};

export default GameModal;
