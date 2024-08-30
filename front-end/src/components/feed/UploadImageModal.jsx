import React, { useState } from "react";
import ReactDOM from "react-dom";
import modalStyles from "../modal/Modal.module.css";
import styles from "./FeedModal.module.css";
import axios from "axios"; // axios를 import

const UploadImageModal = ({ feed, onShow, onClose, onSave }) => {
  const [writer, setWriter] = useState(""); // Assuming this will be set somewhere
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const handleSaveClick = () => {
    onUpload();
    onClose();
  };

  const onFileChange = (e) => {
    setFiles(e.target.files);
  };

  const onUpload = () => {
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    axios
      .post("http://localhost:8089/wefam/add-feed-img", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Files uploaded successfully");
        // Call onSave() if necessary after successful upload
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
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
          <input type="file" multiple onChange={onFileChange} />
          {/* 모달 하단 버튼들 */}
          <div className={modalStyles.modalFooter}>
            <button className={modalStyles.cancelButton} onClick={onClose}>
              취소
            </button>
            <button className={modalStyles.saveButton} onClick={onUpload}>
              저장
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body // 모달을 body에 추가
  );
};

export default UploadImageModal;
