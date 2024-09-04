import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Redux에서 사용자 정보를 가져오기 위한 import
import styles from './CompleteModal.module.css';

Modal.setAppElement('#root');

const CompleteModal = ({ isOpen, onRequestClose, taskName, onComplete }) => {
  const userId = useSelector((state) => state.user.userData.id); // Redux에서 userId를 가져옴
  const familyIdx = useSelector((state) => state.user.userData.familyIdx); // Redux에서 familyIdx를 가져옴
  const [selectedFiles, setSelectedFiles] = useState([]); // 파일을 저장할 상태

  // 파일이 드롭되거나 선택될 때 호출되는 함수
  const onDrop = (acceptedFiles) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  // react-dropzone 설정
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const removeFile = (fileName) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  // 이미지 및 작업 완료 정보 전송
  const handleCompleteConfirm = async () => {
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("images", file);
      formData.append("fileNames", file.name);
      formData.append("fileExtensions", file.name.split(".").pop());
      formData.append("fileSizes", file.size);
    });

    formData.append("familyIdx", familyIdx); // Redux에서 가져온 familyIdx
    formData.append("userId", userId); // Redux에서 가져온 userId
    formData.append("entityType", "work");
    formData.append("entityIdx", 1); // 작업 ID
    formData.append("completed", true);

    try {
      const response = await axios.post(
        "http://localhost:8089/wefam/complete-with-files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        alert("작업 완료 및 이미지 저장이 완료되었습니다.");
        onComplete(); // 완료 후 호출
      } else {
        console.error("서버 오류:", response);
      }
    } catch (error) {
      console.error("작업 완료 및 이미지 저장 중 오류 발생:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="미션 완료"
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalBody}>
        <h2>미션 완료</h2>
        <p>"{taskName}"을(를) 완료하셨습니까?</p>

        <div {...getRootProps({ className: styles.dropzone })}>
          <input {...getInputProps()} />
          {selectedFiles.length === 0 ? (
            <p onClick={open} style={{ cursor: 'pointer' }}>
              여기를 클릭하거나 이미지를 드롭하여 업로드하세요.
            </p>
          ) : (
            <div className={styles.previewArea}>
              <img
                src={URL.createObjectURL(selectedFiles[0])}
                alt={selectedFiles[0].name}
                className={styles.previewImage}
              />
            </div>
          )}
        </div>

        <ul className={styles.fileList}>
          {selectedFiles.map((file) => (
            <li key={file.name} className={styles.fileItem}>
              {file.name}
              <button
                onClick={() => removeFile(file.name)}
                className={styles.removeFileButton}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.buttonContainer}>
          <button className={styles.confirmButton} onClick={handleCompleteConfirm}>
            예, 완료했습니다
          </button>
          <button className={styles.cancelButton} onClick={onRequestClose}>
            취소
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CompleteModal;
