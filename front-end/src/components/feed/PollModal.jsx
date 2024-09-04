import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import modalStyles from "../modal/Modal.module.css";
import styles from "./PollModal.module.css";
import Preloader from "../preloader/Preloader";
import { addPoll } from "../../features/pollSlice";
import { BsDot } from "react-icons/bs";
import { BsTrash } from "react-icons/bs";

const PollModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(""); // 투표 제목
  const [options, setOptions] = useState(["", ""]); // 투표 항목 기본 2개

  // 투표 항목 추가
  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  // 투표 항목 삭제
  const deleteOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  // 투표 항목 변경 핸들러
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // 저장 버튼
  const onSave = async () => {
    setIsLoading(true);

    // 새로운 투표 객체 생성
    const newPoll = {
      id: Date.now(), // 고유한 ID를 생성하기 위해 현재 시간을 사용
      title,
      options: options.filter((option) => option.trim() !== ""),
    };

    // 투표 데이터를 Redux에 저장
    dispatch(addPoll(newPoll));

    setIsLoading(false);
    onClose();
    setIsLoading(false);
    onClose();
  };

  return ReactDOM.createPortal(
    isLoading ? (
      <div className={modalStyles.modal}>
        <Preloader isLoading={isLoading} />
      </div>
    ) : (
      <div className={modalStyles.modal} onClick={onClose}>
        <div
          className={modalStyles["modal-content"]}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.main}>
            <input
              type="text"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.inputTitle}
            />
            <div className={styles.optionsContainer}>
              {options.map((option, index) => (
                <div key={index} className={styles.option}>
                  <BsDot />
                  <input
                    type="text"
                    placeholder={`투표 항목 ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className={styles.inputOption}
                  />
                  <button
                    onClick={() => deleteOption(index)}
                    className={`${styles.deleteOptionBtn} ${
                      options.length <= 2 ? styles.disabled : styles.abled
                    }`} // 길이가 2 이하일 때 .disabled 클래스 추가
                    disabled={options.length <= 2} // 길이가 2 이하일 때 버튼 비활성화
                  >
                    <BsTrash />
                  </button>
                </div>
              ))}
            </div>

            {options.length < 5 && (
              <button onClick={addOption} className={styles.addOptionBtn}>
                항목 추가
              </button>
            )}

            {/* 푸터 */}
            <div className={modalStyles.modalFooter}>
              <button className={modalStyles.cancelButton} onClick={onClose}>
                취소
              </button>
              <button className={modalStyles.saveButton} onClick={onSave}>
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    document.body
  );
};

export default PollModal;
