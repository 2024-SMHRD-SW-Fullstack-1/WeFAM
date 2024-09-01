import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import { addImage, clearImages } from "../../features/imagesOnFeedSlice";
import modalStyles from "../modal/Modal.module.css";
import styles from "./UploadImageModal.module.css";

import { CiImageOn } from "react-icons/ci";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

const UploadImageModal = ({ onClose }) => {
  const [imgPreview, setImgPreview] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 인덱스
  const dispatch = useDispatch();
  const maxImageCnt = 10;

  const uploadImages = (files) => {
    let imageUrlList = [...imgPreview];

    if (files.length + imgPreview.length > maxImageCnt) {
      alert("이미지는 최대 10개까지 업로드 가능합니다!");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const currentImageUrl = URL.createObjectURL(files[i]);
      imageUrlList.push(currentImageUrl);
    }
    setImgPreview(imageUrlList);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setDragging(false);

      const droppedFiles = Array.from(event.dataTransfer.files);
      uploadImages(droppedFiles);
    },
    [uploadImages, selectedFiles, imgPreview]
  );

  const onFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    uploadImages(newFiles);
  };

  // 취소 버튼
  const handleCancel = () => {
    dispatch(clearImages());
    setImgPreview([]);
    setSelectedFiles([]); // 선택된 파일 목록도 초기화
    onClose();
  };

  // 저장 버튼: 선택된 파일들을 리덕스에 저장
  const onSave = () => {
    dispatch(clearImages()); // 기존 저장된 이미지 삭제
    selectedFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      dispatch(addImage({ url, file }));
    });
    onClose();
  };

  // 슬라이드 이전으로 이동
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  // 슬라이드 다음으로 이동
  const handleNextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, imgPreview.length - 1));
  };

  const dropzoneClassName = `${styles.dropzone} ${
    dragging ? styles.dragging : ""
  }`;

  return ReactDOM.createPortal(
    <div className={modalStyles.modal} onClick={onClose}>
      <div
        className={modalStyles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.imgModal}>
          {imgPreview.length > 0 ? (
            <div className={styles.preview}>
              {currentSlide > 0 && (
                <div className={styles.leftArrow} onClick={handlePrevSlide}>
                  <MdKeyboardArrowLeft />
                </div>
              )}
              <img
                src={imgPreview[currentSlide]}
                alt={`preview-${currentSlide}`}
              />
              {currentSlide < imgPreview.length - 1 && (
                <div className={styles.rightArrow} onClick={handleNextSlide}>
                  <MdKeyboardArrowRight />
                </div>
              )}
            </div>
          ) : (
            <div
              className={dropzoneClassName}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CiImageOn />
              <p>사진을 여기에 끌어다 놓으세요!</p>
              <div className={styles.filebox}>
                <input
                  className={styles.uploadName}
                  placeholder="첨부파일"
                  readOnly
                />
                <label htmlFor="file">파일찾기</label>
                <input type="file" id="file" multiple onChange={onFileChange} />
              </div>
            </div>
          )}

          <div className={modalStyles.modalFooter}>
            <button className={modalStyles.cancelButton} onClick={handleCancel}>
              취소
            </button>
            <button className={modalStyles.saveButton} onClick={onSave}>
              등록
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UploadImageModal;
