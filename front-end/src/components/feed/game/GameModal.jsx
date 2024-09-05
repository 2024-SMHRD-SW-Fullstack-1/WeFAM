import React, { useState } from "react";
import ReactDOM from "react-dom";
import modalStyles from "../../modal/Modal.module.css";
import Roulette from "./Roulette"; // 룰렛 컴포넌트 임포트

const GameModal = ({ onClose }) => {
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isGhostLegModalOpen, setIsGhostLegModalOpen] = useState(false);

  const handleRouletteOpen = () => {
    setIsRouletteOpen(true);
  };

  return ReactDOM.createPortal(
    <div className={modalStyles.modal} onClick={onClose}>
      <div
        className={modalStyles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        {!isRouletteOpen && !isGhostLegModalOpen && (
          <>
            <div>
              <button onClick={handleRouletteOpen}>
                <img src="" alt="룰렛 아이콘" />
                <span>룰렛</span>
              </button>
              <button onClick={() => setIsGhostLegModalOpen(true)}>
                <img src="" alt="사다리타기 아이콘" />
                <span>사다리타기</span>
              </button>
              <button>
                <img src="" alt="제비뽑기 아이콘" />
                <span>제비뽑기</span>
              </button>
            </div>
            {/* 모달 하단 버튼들 */}
            <div className={modalStyles.modalFooter}>
              <button className={modalStyles.cancelButton} onClick={onClose}>
                취소
              </button>
            </div>
          </>
        )}
        {isRouletteOpen && (
          <div>
            <Roulette /> {/* 룰렛 컴포넌트 렌더링 */}
            <button onClick={() => setIsRouletteOpen(false)}>닫기</button>
          </div>
        )}
      </div>
    </div>,
    document.body // 모달을 body에 추가
  );
};

export default GameModal;
