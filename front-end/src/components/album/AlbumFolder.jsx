import React, { useState } from "react";
import { useSelector } from "react-redux";
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 슬라이드의 인덱스
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // 이미지 확대 모달 상태

  const userData = useSelector((state) => state.user.userData);
  // 로그인한 사용자의 데이터 확인
  console.log("userData : ", userData);

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

  // 이미지 저장하는 함수

  // const saveImages = async ()=> {
  //   const forData = new FormData();
  //   selectedFiles.forEach((file)=>{
  //     FormData.append("images", file);
  //   });
    
  //   try {
  //     const response = await fetch("/api/upload-images", {
  //       method: "POST",
  //       body: FormData,
  //     });

  //     if (response.ok) {
  //       const savedImages = await response.json();
  //       const newImages = savedImages.map((img) => ({
  //         id: img.id,
  //         url: img.url,
  //         selected: false,
  //       }));
  //       setImages()
  //     }
  //   }

    
  // }


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
                onClick={() => openImageModal(index)} // 이미지 클릭 시 확대 모달 오픈
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
            <button className={styles.modalButton} onClick={inputImages}>
              추가
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
