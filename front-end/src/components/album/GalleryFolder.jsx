import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone'; // react-dropzone import
import styles from "./GalleryFolder.module.css";
import { RiDragDropLine } from "react-icons/ri";

Modal.setAppElement('#root');

const GalleryFolder = () => {
    const { name } = useParams();
    const [images, setImages] = useState([]); // 상태: 이미지 목록
    const [selectedImages, setSelectedImages] = useState([]); // 상태: 선택된 이미지 목록
    const [isModalOpen, setIsModalOpen] = useState(false); // 상태: 모달 열림 여부
    const [selectedFiles, setSelectedFiles] = useState([]); // 상태: 선택된 파일 목록
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false); // 상태: 삭제 확인 모달 열림 여부

    // 모달 열기
    const openModal = () => setIsModalOpen(true);

    // 모달 닫기
    const closeModal = () => {
        setSelectedFiles([]); // 모달 닫을 때 선택된 파일 목록 초기화
        setIsModalOpen(false);
    };

    // 삭제 확인 모달 열기
    const openConfirmDeleteModal = () => setIsConfirmDeleteOpen(true);

    // 삭제 확인 모달 닫기
    const closeConfirmDeleteModal = () => setIsConfirmDeleteOpen(false);

    // 삭제 확인
    const confirmDelete = () => {
        setImages((prevImages) =>
            prevImages.filter((image) => !selectedImages.includes(image.id)) // 선택되지 않은 이미지만 남김
        );
        setSelectedImages([]); // 선택된 이미지 목록 초기화
        closeConfirmDeleteModal(); // 확인 모달 닫기
    };

    // react-dropzone 설정
    const onDrop = (acceptedFiles) => {
        setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    // react-dropzone 훅을 사용하여 드래그 앤 드롭 기능 설정
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    // 파일을 목록에서 제거하는 함수
    const removeFile = (fileName) => {
        setSelectedFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));
    };

    // 선택된 파일을 이미지로 저장하는 함수
    const saveImages = () => {
        // 새로운 이미지 목록 생성
        const newImages = selectedFiles.map(file => ({
            id: images.length + 1 + Math.random(), // 고유 ID 생성
            url: URL.createObjectURL(file), // 파일 URL 생성
            selected: false,
        }));
        setImages([...images, ...newImages]); // 기존 이미지 목록에 추가
        setSelectedFiles([]); // 선택된 파일 목록 초기화
        closeModal(); // 모달 닫기
    };

    // 이미지 선택 토글 함수
    const toggleImageSelection = (id) => {
        setSelectedImages((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((imageId) => imageId !== id) // 선택 해제
                : [...prevSelected, id] // 선택 추가
        );
    };

    // 전체 이미지 선택/해제 함수
    const toggleAllImages = (event) => {
        if (event.target.checked) {
            setSelectedImages(images.map(image => image.id)); // 전체 이미지 선택
        } else {
            setSelectedImages([]); // 전체 선택 해제
        }
    };

    // 파일 이름을 줄이는 함수
    const truncateFileName = (name, maxLength = 20) => {
        if (name.length > maxLength) {
            return `${name.slice(0, maxLength)}...`;
        }
        return name;
    };

    return (
        <div className="main">
            <div className={styles.galleryHead}>
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
                    <button className={styles.btnDelete} onClick={openConfirmDeleteModal}>
                        삭제
                    </button>
                    <div className={styles.saveAndCheckbox}>
                        <button className={styles.btnAdd}>저장</button>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                onChange={toggleAllImages}
                                checked={selectedImages.length === images.length && images.length > 0}
                            />
                            전체선택
                        </label>
                    </div>
                    <button className={styles.btnPlus} onClick={openModal}>+</button>
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
                        <img src={image.url} alt={`img-${image.id}`} className={styles.image} />
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
                {/* 드래그 앤 드롭 영역 */}
                <div {...getRootProps({ className: isDragActive ? `${styles.dropzone} ${styles.dragActive}` : styles.dropzone })}>
                    <input {...getInputProps()} />
                    <RiDragDropLine className={styles.dragImg} />
                    <p>이미지 가져오기</p>
                </div>

                <ul className={styles.fileList}>
                    {selectedFiles.map((file) => (
                        <li key={file.name} className={styles.fileItem}>
                            <img src={URL.createObjectURL(file)} alt={file.name} className={styles.filePreview} />
                            <span>{truncateFileName(file.name)}</span> {/* 파일 이름 줄이기 */}
                            <button onClick={() => removeFile(file.name)}>삭제</button>
                        </li>
                    ))}
                </ul>
                
                <div>
                    <button className={styles.modalButton} onClick={saveImages}>저장</button>
                </div>
            </Modal>

            {/* 삭제 확인 모달 */}
            <Modal
                isOpen={isConfirmDeleteOpen}
                onRequestClose={closeConfirmDeleteModal}
                contentLabel="삭제 확인"
                className={styles.folderModal}
                overlayClassName={styles.folderOverlay}
            >
                <h1>삭제 확인</h1>
                <p>선택한 이미지를 정말 삭제하시겠습니까?</p>
                <div className={styles.confirmButtons}>
                    <button className={styles.confirmButton} onClick={confirmDelete}>확인</button>
                    <button className={styles.cancelButton} onClick={closeConfirmDeleteModal}>취소</button>
                </div>
            </Modal>
        </div>
    );
};

export default GalleryFolder;
