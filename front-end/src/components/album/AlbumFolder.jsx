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
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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

  // 이미지 저장
const saveImages = () => {
  const formData = new FormData();

  selectedFiles.forEach((file) => {
    formData.append("images", file);
    formData.append("fileNames", file.name);
    formData.append("fileExtensions", file.name.split(".").pop());
    formData.append("fileSizes", file.size);
  });

  formData.append("familyIdx", 1);  // 예시로 familyIdx 1을 사용
  formData.append("userId", userId);
  formData.append("entityIdx", 1); // 예시로 albumId 1을 사용

  axios
    .post("http://localhost:8089/wefam/add-album-img", formData)
    .then((response) => {
      console.log("이미지 저장 성공:", response.data);
      // 이미지를 성공적으로 저장한 후 로컬 상태 초기화
      setSelectedFiles([]);
      setImages([]);  // 저장 후 이미지 리스트를 다시 불러오는 게 좋음
      closeModal();   // 모달 닫기
      window.location.reload();  // 이미지가 추가된 후 화면을 새로고침
    })
    .catch((error) => {
      console.error("이미지 저장 실패:", error);
    });
};


  // 이미지 초기 로드
  const loadImages = () => {
    axios.get(`http://localhost:8089/wefam/get-album-img`) // 앨범 ID, 필요에 따라 설정
      .then(response => {
        const loadedImages = response.data.map((img, index) => ({
          id: img.fileIdx,
          url: `data:image/jpeg;base64,${img.fileData}`, // Base64로 인코딩된 이미지
          selected: false,
        }));
        setImages(loadedImages);
      })
      .catch(error => {
        console.error('이미지 로드 실패:', error);
      });
  };

  useEffect(() => {
    if (userId) {
      loadImages();
    }
  }, [userId]);

  const toggleImageSelection = (id) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((imageId) => imageId !== id)
        : [...prevSelected, id]
    );
  };

  const deleteSelectedImages = () => {
    const deleteIds = selectedImages.map(id => images.find(img => img.id === id).fileIdx);

    axios.post('http://localhost:8089/wefam/delete-album-img', { ids: deleteIds })
      .then(response => {
        console.log('이미지 삭제 성공:', response.data);
        setImages(prevImages => prevImages.filter(img => !selectedImages.includes(img.id)));
        setSelectedImages([]);
      })
      .catch(error => {
        console.error('이미지 삭제 실패:', error);
      });
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
            <button className={styles.btnDelete} onClick={deleteSelectedImages}>
              삭제
            </button>
            <div className={styles.saveAndCheckbox}>
              <button className={styles.btnAdd} onClick={saveImages}>저장</button>
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
