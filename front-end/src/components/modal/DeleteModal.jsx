import React from "react";
import "./Modal.module.css"; // 이미 작성한 CSS 파일 사용

const DeleteModal = ({ showModal, onClose, onConfirm }) => {
  if (!showModal) return null; // 모달이 열리지 않으면 렌더링하지 않음

  return (
    <div className='main'>
      <div className='modal'>
        <div className='modal-content'>
          <div>
            <h3>삭제 확인</h3>
            <span className='close-button' onClick={onClose}>
              &times;
            </span>

            <div>
              <p>정말로 삭제하시겠습니까?</p>
            </div>
          </div>

          <div className='modalFooter'>
            <button className='cancelButton' onClick={onClose}>
              취소
            </button>
            <button className='saveButton' onClick={onConfirm}>
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
