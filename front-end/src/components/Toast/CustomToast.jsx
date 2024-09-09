import React from "react";
import styles from "./CustomToast.module.css"; // CSS 모듈 경로
import { CiCircleCheck } from "react-icons/ci";
import { BsTrash } from "react-icons/bs";

const CustomToast = ({ type, message, onClose }) => {
  const getIcon = () => {
    return type === "success" ? <CiCircleCheck /> : <BsTrash />;
  };

  const getTitle = () => {
    return type === "success" ? "Success" : "Error";
  };

  return (
    <div className={`${styles.toastContainer} ${styles[type]}`}>
      <div className={styles.icon}>{getIcon()}</div>
      <div className={styles.message}>
        <strong>{getTitle()}</strong>
        <p>{message}</p>
      </div>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default CustomToast;
