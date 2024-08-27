import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./Album.module.css";
import { useNavigate } from "react-router-dom";

// 모달의 루트 엘리먼트를 설정합니다
Modal.setAppElement("#root");

const Album = () => {
  const nav = useNavigate();

  // 폴더 목록 상태 관리
  const [folders, setFolders] = useState([
    { id: 1, name: "모든사진", photoCount: 0, icon: "📁" },
    { id: 2, name: "질의응답", photoCount: 0, icon: "👨‍👩‍👧‍👦" },
  ]);

  // 선택된 폴더 상태 관리
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [nameError, setNameError] = useState(""); // 폴더 이름 에러 메시지 상태

  // 폴더 추가
  const addFolder = () => {
    if (newFolderName.length > 10) {
      setNameError("폴더 이름은 최대 10글자까지 가능합니다.");
    } else if (newFolderName) {
      const newFolder = {
        id: folders.length + 1,
        name: newFolderName,
        photoCount: 0,
        icon: "📁",
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setNameError(""); // 폴더 추가 시 에러 메시지 초기화
      closeModal(); // 폴더 추가 후 모달 닫기
    }
  };

  const openModal = () => {
    setNewFolderName(""); // 모달 열 때 폴더 이름 초기화
    setNameError(""); // 모달 열 때 에러 메시지 초기화
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setNewFolderName(""); // 모달 닫을 때 폴더 이름 초기화
    setIsModalOpen(false);
  };

  // 폴더 선택/해제 함수
  const toggleFolderSelection = (id) => {
    setSelectedFolders((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((folderId) => folderId !== id)
        : [...prevSelected, id]
    );
  };

  // 선택된 폴더 삭제 함수
  const deleteSelectedFolders = () => {
    setFolders((prevFolders) =>
      prevFolders.filter(
        (folder) =>
          !selectedFolders.includes(folder.id) || [1, 2].includes(folder.id)
      )
    );
    setSelectedFolders([]); // 삭제 후 선택된 상태 초기화
  };

  // 전체 선택/해제 함수
  const toggleAllFolders = (event) => {
    if (event.target.checked) {
      // 기본 폴더(모든 사진, 질의응답) 제외하고 나머지 모든 폴더 선택
      setSelectedFolders(
        folders.filter((folder) => folder.id > 2).map((folder) => folder.id)
      );
    } else {
      // 모든 폴더 선택 해제
      setSelectedFolders([]);
    }
  };

  // 엔터키 입력 처리 함수
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 엔터키 기본 동작 방지
      addFolder(); // 폴더 추가 함수 호출
      // 폴더 추가가 성공적으로 이루어진 경우에만 모달 닫기
      if (newFolderName && newFolderName.length <= 10) {
        closeModal();
      }
    }
  };

  // 폴더 클릭
  const handleFolderClick = (name) => {
    nav(`/album/${name}`); // 클릭한 폴더의 name에 따라 다른 경로로 이동
  };

  return (
    <div className="main">
      <div className={styles.albumHead}>
        <h1>앨범</h1>
        <div className={styles.imgSetting}>
          <button className={styles.btnDelete} onClick={deleteSelectedFolders}>
            삭제
          </button>
          <div className={styles.saveAndCheckbox}>
            <button className={styles.btnAdd} onClick={openModal}>
              추가
            </button>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                onChange={toggleAllFolders}
                checked={
                  folders.length > 2 &&
                  selectedFolders.length ===
                    folders.filter((folder) => folder.id > 2).length
                }
              />
              전체선택
            </label>
          </div>
        </div>
      </div>

      <div className={styles.folderContainer}>
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`${styles.folder} ${styles.hoverEffect} ${
              folder.id > 2 ? styles.hoverEffect : ""
            }`}
            onClick={() => handleFolderClick(folder.name)} // 폴더 클릭 시 페이지 이동
          >
            {/* 기본 폴더(모든 사진, 질의응답)에는 체크박스를 숨기거나 비활성화 */}
            {folder.id > 2 && (
              <input
                type="checkbox"
                className={styles.folderCheckbox}
                checked={selectedFolders.includes(folder.id)}
                onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
                onChange={() => toggleFolderSelection(folder.id)}
              />
            )}
            <div className={styles.folderIcon}>{folder.icon}</div>
            <div className={styles.folderName}>{folder.name}</div>
            <div className={styles.photoCount}>
              {folder.photoCount} photo{folder.photoCount !== 1 ? "s" : ""}
            </div>
          </div>
        ))}
      </div>

      {/* 모달 컴포넌트 */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="폴더 추가"
        className={styles.albumModal}
        overlayClassName={styles.albumOverlay}
      >
        <h1>폴더 추가</h1>
        <input
          className={styles.ModalInput}
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onKeyDown={handleKeyDown} // 엔터키 입력 처리
          placeholder="폴더명을 입력해주세요."
        />
        {nameError && <p className={styles.errorText}>{nameError}</p>}
        <div className={styles.modalButtons}>
          <button className={styles.cancelButton} onClick={closeModal}>
            취소
          </button>
          <button className={styles.createButton} onClick={addFolder}>
            저장
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Album;
