import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { addImage, clearImages } from "../../features/imagesOnFeedSlice";
import modalStyles from "../modal/Modal.module.css";
import styles from "./UploadImageModal.module.css";

import { CiImageOn } from "react-icons/ci";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

const UploadImageModal = ({ onClose }) => {
  const [imgPreview, setImgPreview] = useState([]);
  const [dragging, setDragging] = useState(false);
  const dispatch = useDispatch();
  let images = useSelector((state) => state.imagesOnFeed);
  const maxImageCnt = 10;

  console.log("Redux 상태 images:", images);
  console.log("images는 배열인가요?", Array.isArray(images));

  const uploadImages = (files) => {
    // 이미지를 Redux에 넣기 전에 우선 Redux에 저장된 이미지를 모두 삭제
    // dispatch는 순서가 보장됩니다. 그러므로 clear 후에 add가 됩니다.
    dispatch(clearImages());

    let imageUrlList = [...imgPreview];

    if (files.length + imgPreview.length > maxImageCnt) {
      alert("이미지는 최대 10개까지 업로드 가능합니다!");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const currentImageUrl = URL.createObjectURL(files[i]);
      imageUrlList.push(currentImageUrl);
      dispatch(addImage({ url: currentImageUrl, file: files[i] }));
    }

    setImgPreview(imageUrlList);
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
    [uploadImages]
  );

  const handleClearImages = () => {
    dispatch(clearImages());
  };

  const onFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    uploadImages(selectedFiles);
  };

  // 취소 버튼
  const handleCancel = () => {
    dispatch(clearImages());
    setImgPreview([]); // 미리보기 이미지도 비우기
    onClose();
  };

  const onSave = () => {
    console.log("Saving images...");
    onClose();
  };
  // className을 동적으로 설정
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
              <div className={styles.leftArrow}>
                <MdKeyboardArrowLeft />
              </div>
              {imgPreview.map((url, index) => (
                <img key={index} src={url} alt={`preview-${index}`} />
              ))}
              <div className={styles.rightArrow}>
                <MdKeyboardArrowRight />
              </div>
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
            <button onClick={handleClearImages}>이미지 비우기</button>
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
