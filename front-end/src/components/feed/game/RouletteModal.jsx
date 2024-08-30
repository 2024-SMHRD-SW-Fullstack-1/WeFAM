import React, { useState } from "react";
import ReactDOM from "react-dom";
import modalStyles from "../../modal/Modal.module.css";
import Roulette from "./Roulette";

const RouletteModal = ({ onClose }) => {
  return ReactDOM.createPortal(
    <div className={modalStyles.modal} onClick={onClose}>
      <div
        className={modalStyles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <Roulette />
      </div>
    </div>,
    document.body // 모달을 body에 추가
  );
};

export default RouletteModal;
