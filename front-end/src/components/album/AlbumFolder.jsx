import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone"; // react-dropzone import
import styles from "./AlbumFolder.module.css";

Modal.setAppElement("#root");

const AlbumFolder = () => {
  const { name } = useParams();
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // react-dropzone 설정
  const onDrop = (acceptedFiles) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (fileName) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const saveImages = () => {
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

  const deleteSelectedImages = () => {
    setImages((prevImages) =>
      prevImages.filter((image) => !selectedImages.includes(image.id))
    );
    setSelectedImages([]);
  };

  const toggleAllImages = (event) => {
    if (event.target.checked) {
      setSelectedImages(images.map((image) => image.id));
    } else {
      setSelectedImages([]);
    }
  };

  return (
    <div className="main">
      <div className={styles.albumHead}>
        <div className={styles.headTitle}>
          <div className={styles.folderName}>
            <h1>갤러리</h1>
            <p className={styles.folderNameText}>{name}</p>
          </div>
          <div className={styles.imgArray}>
            <p>정렬순서</p>
            <select>
              <option>최신 순</option>
              <option>오래된 순</option>
            </select>
          </div>
        </div>

        <div className={styles.imgSetting}>
          <button className={styles.btnDelete} onClick={deleteSelectedImages}>
            삭제
          </button>
          <div className={styles.saveAndCheckbox}>
            <button className={styles.btnAdd}>저장</button>
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
        {images.map((image) => (
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
          <p>이곳에 파일을 드롭해주세요</p>
          <button>이미지 추가</button>
        </div>

        <ul className={styles.fileList}>
          {selectedFiles.map((file) => (
            <li key={file.name} className={styles.fileItem}>
              {file.name}
              <button onClick={() => removeFile(file.name)}>삭제</button>
            </li>
          ))}
        </ul>

        <div>
          <button className={styles.modalButton} onClick={saveImages}>
            저장
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AlbumFolder;
