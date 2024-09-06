import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./AddRewardModal.module.css";
import { useDropzone } from "react-dropzone";

Modal.setAppElement("#root");

const AddRewardModal = ({ isOpen, onRequestClose, onAddReward }) => {
    const [rewardName, setRewardName] = useState("");
    const [rewardPoints, setRewardPoints] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Dropzone 설정
    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop: (acceptedFiles) => {
            setSelectedFiles(acceptedFiles.map((file) => Object.assign(file, {
                preview: URL.createObjectURL(file) // 이미지 미리보기를 위해 URL 생성
            })));
        },
        noClick: true,
        noKeyboard: true
    });

    const handleAddReward = () => {
        if (rewardName && rewardPoints && selectedFiles.length > 0) {
            onAddReward({
                name: rewardName,
                points: parseInt(rewardPoints, 10),
                image: selectedFiles[0].preview, // 이미지 URL 추가
            });
            setRewardName(""); // 입력 필드 초기화
            setRewardPoints("");
            setSelectedFiles([]); // 선택된 파일 초기화
            onRequestClose(); // 모달 닫기
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="보상 추가"
            className={styles.modalContent}
            overlayClassName={styles.modalOverlay}
        >
            <div className={styles.modalHeader}>
                <h2>보상 추가</h2>
                <button onClick={onRequestClose} className={styles.closeButton}>
                    &times;
                </button>
            </div>
            <div className={styles.modalBody}>
                <label>
                    보상 이름:
                    <input
                        type="text"
                        value={rewardName}
                        onChange={(e) => setRewardName(e.target.value)}
                    />
                </label>
                <label>
                    필요한 포인트:
                    <input
                        type="number"
                        value={rewardPoints}
                        onChange={(e) => setRewardPoints(e.target.value)}
                    />
                </label>
                {/* 드롭존 */}
                <div {...getRootProps({ className: styles.dropzone })} onClick={open}>
                    <input {...getInputProps()} />
                    {selectedFiles.length === 0 ? (
                        <p className={styles.dropzoneText}>여기를 클릭하거나 이미지를 드롭하여 업로드하세요.</p>
                    ) : (
                        <div className={styles.previewContainer}>
                            <img
                                src={selectedFiles[0].preview}
                                alt="Preview"
                                className={styles.previewImage}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.modalFooter}>
                <button onClick={handleAddReward} className={styles.addButton}>
                    추가
                </button>
            </div>
        </Modal>
    );
};

export default AddRewardModal;
