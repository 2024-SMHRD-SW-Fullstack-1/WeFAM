import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CiImageOn, CiCircleMinus } from "react-icons/ci";
import styles from "./AddRecipe.module.css";

import { BsPlus, BsPlusCircle } from "react-icons/bs";

const AddRecipe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState("");
  const [cookImages, setCookImages] = useState([]);
  const [cookImagesPreview, setCookImagesPreview] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [cookSteps, setCookSteps] = useState([
    { image: "", imagePreview: "", description: "" },
  ]);

  // 이미지 미리보기 함수
  const previewThumbnailImage = (selectedImage) => {
    const imageUrl = URL.createObjectURL(selectedImage);
    setThumbnailImagePreview(imageUrl);
  };

  // 요리 단계 이미지 미리보기 함수
  const previewCookImage = (selectedImage) => {
    const imageUrl = URL.createObjectURL(selectedImage);
    setCookImagesPreview((prev) => [...prev, imageUrl]);
  };

  // 파일 선택 핸들러 (대표 이미지)
  const onThumbnailImageChange = (e) => {
    const newThumbnailImage = e.target.files[0];
    if (newThumbnailImage) {
      setThumbnailImage(newThumbnailImage);
      previewThumbnailImage(newThumbnailImage);
    }
  };

  // 파일 선택 핸들러 (요리 단계 이미지)
  const onCookImageChange = (e) => {
    const newCookImage = e.target.files[0];
    if (newCookImage) {
      setCookImages((prev) => [...prev, newCookImage]);
      previewCookImage(newCookImage);
    }
  };

  // Drag & Drop 핸들러 (대표 이미지)
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setDragging(false);

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setThumbnailImage(droppedFile);
      previewThumbnailImage(droppedFile); // 수정된 함수 호출
    }
  }, []);

  const dropzoneClassName = `${styles.dropzone} ${
    dragging ? styles.dragging : ""
  }`;

  // 파일 선택 핸들러 (요리 단계 설명)
  const onCookDescriptionChange = (e, index) => {
    const newDescription = e.target.value;
    setCookSteps((prevSteps) =>
      prevSteps.map((step, i) =>
        i === index ? { ...step, description: newDescription } : step
      )
    );
  };

  // 순서 추가 핸들러
  const addStep = () => {
    setCookSteps((prevSteps) => [
      ...prevSteps,
      { image: "", imagePreview: "", description: "" },
    ]);
  };

  return (
    <div className="main">
      <div className={styles.addRecipe}>
        <div className={styles.header}>
          <input
            className={styles.recipeName}
            placeholder="레시피 제목을 입력하세요."
          />
          <div className={styles.controller}>
            <button className={styles.resetBtn}>초기화</button>
            <button className={styles.saveBtn}>저장</button>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.meta}>
            <div className={styles.thumbnailImgContainer}>
              {/* 이미지 프리뷰 */}
              {thumbnailImagePreview === "" ? (
                <div
                  className={dropzoneClassName}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop} // 대표 이미지 드롭 핸들러
                >
                  <div className={styles.dropzoneIcon}>
                    <CiImageOn />
                  </div>
                  <div className={styles.dropzoneText}>요리 대표 사진</div>
                  <div className={styles.dropzoneBtn}>
                    <label htmlFor="thumbnailImage">컴퓨터에서 선택</label>
                    <input
                      type="file"
                      id="thumbnailImage"
                      onChange={onThumbnailImageChange} // 대표 이미지 파일 선택 핸들러
                    />
                  </div>
                </div>
              ) : (
                <img
                  src={thumbnailImagePreview}
                  alt="대표 사진 미리보기"
                  className={styles.thumnailImgPreview}
                />
              )}
            </div>
            <div className={styles.infoContainer}>
              <div className={styles.time}>
                <label className={styles.labelTime}>조리시간</label>
                <input className={styles.inputTime} />
                <label>시간</label>
                <input className={styles.inputTime} />
                <label>분</label>
              </div>
              <div className={styles.portion}>
                <label className={styles.labelPortion}>인분수</label>
                <input className={styles.inputPortion} />
                <label htmlFor="">인분</label>
              </div>
              <div className={styles.ingre}>
                <label className={styles.labelIngre}>재료</label>
                <textarea
                  className={styles.textIngre}
                  placeholder="재료를 작성해주세요."
                ></textarea>
              </div>
            </div>
          </div>

          <div className={styles.catContainer}>
            <p>카테고리</p>
            <div className={styles.cats}>
              <button>일상</button>
              <button>캠핑</button>
              <button>파티</button>
            </div>
          </div>

          {/* 요리 소개 */}
          <div className={styles.descContainer}>
            <p>요리 소개</p>
            <textarea
              className={styles.desc}
              placeholder="간단하게 요리를 소개해주세요."
            ></textarea>
          </div>

          {/* 요리 순서 */}
          <div className={styles.cookContainer}>
            <div className={styles.stepContainer}>
              <p>요리 순서</p>
              {cookSteps.map((step, index) => (
                <div key={index} className={styles.step}>
                  <p className={styles.stepSeq}>Step {index + 1}</p>
                  <div className={styles.cookImgContainer}>
                    <div
                      className={dropzoneClassName}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop} // 요리 단계 이미지 드롭 핸들러
                    >
                      <div className={styles.cookDropzoneBtn}>
                        <label htmlFor={`cookImage${index}`}>
                          <BsPlus />
                        </label>
                        <input
                          type="file"
                          id={`cookImage${index}`}
                          className={styles.cookImage}
                          onChange={(e) => onCookImageChange(e, index)} // 요리 단계 이미지 파일 선택 핸들러
                        />
                      </div>
                    </div>
                  </div>
                  <textarea
                    className={styles.cook}
                    placeholder="조리법을 입력해주세요."
                    value={step.description}
                    onChange={(e) => onCookDescriptionChange(e, index)}
                  ></textarea>
                  {step.imagePreview && (
                    <img
                      src={step.imagePreview}
                      alt={`요리 단계 ${index + 1}`}
                      className={styles.previewImage}
                    />
                  )}
                </div>
              ))}

              <div className={styles.addStep}>
                <p onClick={addStep}>
                  <BsPlusCircle className={styles.addStepIcon} /> &nbsp; 순서
                  추가
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
