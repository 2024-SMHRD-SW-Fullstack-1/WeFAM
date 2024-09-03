import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone";
import styles from "./AlbumFolder.module.css";
import axios from "axios";

Modal.setAppElement("#root");

const AlbumFolder = () => {
  const { name } = useParams();
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const userId = useSelector((state) => state.user.userData.id);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // react-dropzone 설정
  const onDrop = (acceptedFiles) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setCurrentImageIndex(0); // 이미지 슬라이드를 처음으로 초기화
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true, // 자동으로 열리지 않도록 설정
    noKeyboard: true,
  });

  const removeFile = (fileName) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  // 이미지 로컬 상태에 추가 (브라우저에서 미리보기)
  const inputImages = () => {
    const newImages = selectedFiles.map((file) => ({
      id: images.length + 1 + Math.random(),
      url: URL.createObjectURL(file),
      selected: false,
    }));
    setImages([...images, ...newImages]);
    setSelectedFiles([]);
    closeModal();
  };

  const toggleImageSelection = (id) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((imageId) => imageId !== id)
        : [...prevSelected, id]
    );
  };

  const toggleAllImages = (event) => {
    if (event.target.checked) {
      setSelectedImages(images.map((image) => image.id));
    } else {
      setSelectedImages([]);
    }
  };

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const showNextFile = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === selectedFiles.length - 1 ? 0 : prevIndex + 1
    );
  };

  const showPreviousFile = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedFiles.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="main">
      <div className={styles.albumWrapper}>
        <div className={styles.albumHead}>
          <div className={styles.headTitle}>
            <div className={styles.folderName}>
              <h1>갤러리</h1>
              <p className={styles.folderNameText}>{name}</p>
            </div>
            <div className={styles.imgArray}>
              <p>날짜</p>
              <input type="date" />
              <p>정렬순서</p>
              <select>
                <option>최신 순</option>
                <option>오래된 순</option>
              </select>
            </div>
          </div>

          <div className={styles.imgSetting}>
            <button className={styles.btnDelete}>삭제</button>
            <div className={styles.saveAndCheckbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  onChange={toggleAllImages}
                  checked={
                    selectedImages.length === images.length && images.length > 0
                  }
                />
                전체선택
              </label>
            </div>
            <button className={styles.btnPlus} onClick={openModal}>
              +
            </button>
          </div>
        </div>

        <div className={styles.folderContainer}>
          {images.map((image, index) => (
            <div key={image.id} className={styles.folder}>
              <input
                type="checkbox"
                className={styles.folderCheckbox}
                checked={selectedImages.includes(image.id)}
                onChange={() => toggleImageSelection(image.id)}
              />
              <img
                src={image.url}
                alt={`img-${image.id}`}
                className={styles.image}
                onClick={() => openImageModal(index)}
              />
            </div>
          ))}
        </div>

        {/* 이미지 추가 모달 */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="이미지 등록"
          className={styles.folderModal}
          overlayClassName={styles.folderOverlay}
        >
          <h1>이미지 추가</h1>
          <div {...getRootProps({ className: styles.dropzone })}>
            <input {...getInputProps()} />
            {selectedFiles.length === 0 ? (
              <p onClick={open} style={{ cursor: "pointer" }}>
                여기를 클릭하거나 파일을 드롭해주세요
              </p>
            ) : (
              <div className={styles.previewArea}>
                <img
                  src={URL.createObjectURL(selectedFiles[currentImageIndex])}
                  alt={selectedFiles[currentImageIndex].name}
                  className={styles.previewImage}
                />
                {selectedFiles.length > 1 && (
                  <div className={styles.slideButtons}>
                    <button onClick={showPreviousFile}>{"<"}</button>
                    <button onClick={showNextFile}>{">"}</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <ul className={styles.fileList}>
            {selectedFiles.map((file, index) => (
              <li key={file.name} className={styles.fileItem}>
                {file.name}
                <button
                  onClick={open} // 파일 선택 창을 다시 열기
                  className={styles.inputButton}
                >
                  추가
                </button>
                <button onClick={() => removeFile(file.name)}>삭제</button>
              </li>
            ))}
          </ul>

          <div className={styles.modalButtons}>
            <button className={styles.modalButton} onClick={inputImages}>
              저장
            </button>
            <button className={styles.modalButton} onClick={closeModal}>
              취소
            </button>
          </div>
        </Modal>

        {/* 이미지 확대 모달 */}
        <Modal
          isOpen={isImageModalOpen}
          onRequestClose={closeImageModal}
          contentLabel="이미지 보기"
          className={styles.imageModal}
          overlayClassName={styles.folderOverlay}
        >
          <div className={styles.imageModalContent}>
            <button onClick={showPreviousImage}>{"<"}</button>
            <img
              src={images[currentImageIndex]?.url}
              alt={`img-${currentImageIndex}`}
              className={styles.modalImage}
            />
            <button onClick={showNextImage}>{">"}</button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AlbumFolder;
