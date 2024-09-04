import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import modalStyles from "../modal/Modal.module.css";
import styles from "./AddPollModal.module.css";
import Preloader from "../preloader/Preloader";
import axios from "axios";

const PollModal = ({ feed, poll, onSavePoll, onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isVoted, setIsVoted] = useState(false);
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [selectedOptionNum, setSelectedOptionNum] = useState(null);
  const [voteResult, setVoteResult] = useState(null); // 추가: 투표 결과 상태
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    const fetchPollData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8089/wefam/get-polls/${feed.feedIdx}`
        );
        const data = response.data;
        if (data.length > 0) {
          const pollData = data.find((p) => p.pollIdx === poll.pollIdx);
          if (pollData) {
            console.log("투표 모달창 투표 데이터 : ", pollData);
            setTitle(pollData.pollTitle);
            setOptions(
              pollData.pollOptions.map((opt) => opt.pollOptionContent)
            );
            setSelectedOptionNum(pollData.selectedOptionIdx);
          }
        }
        console.log(userData.id);
        const voteStatus = await axios.get(
          `http://localhost:8089/wefam/get-poll/${poll.pollIdx}/user/${userData.id}/status`
        );
        console.log(poll.pollIdx);
        console.log(voteStatus.data.hasVoted);
        setIsVoted(voteStatus.data.hasVoted);
        onVoteResult();
      } catch (error) {
        console.error(`피드 ${feed.feedIdx}번 투표 요청 에러:`, error);
      }
      setIsLoading(false);
    };

    fetchPollData();
  }, [feed.feedIdx, poll.pollIdx, userData.id]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const onVote = async () => {
    if (selectedOptionNum === null) {
      alert("투표를 선택해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const voteDto = {
        pollIdx: poll.pollIdx,
        userId: userData.id,
        selectedOptionNum: selectedOptionNum,
      };
      console.log("voteDto : ", voteDto);
      await axios.post("http://localhost:8089/wefam/vote", voteDto);
      setIsVoted(true); // 투표한 사람 완료
      // 투표 결과를 가져오기
      await onVoteResult();
    } catch (error) {
      console.error("투표 제출 실패", error);
    }
    setIsLoading(false);
  };

  // 투표 결과를 가져오는 메서드
  const onVoteResult = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8089/wefam/get-vote-result/${poll.pollIdx}`
      );
      console.log("투표 결과 : ", response.data);
      setVoteResult(response.data); // 결과 저장
    } catch (error) {
      console.error("투표 결과 가져오기 실패", error);
    }
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
              readOnly={true}
            />
            <div className={styles.optionsContainer}>
              {options.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.option} ${
                    selectedOptionNum === index ? styles.selected : ""
                  }`}
                >
                  <input
                    type="text"
                    placeholder={`투표 항목 ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className={styles.inputOption}
                    readOnly={true}
                  />
                  <input
                    type="radio"
                    checked={selectedOptionNum === index}
                    onChange={() => setSelectedOptionNum(index)}
                  />
                </div>
              ))}
            </div>

            <div className={modalStyles.modalFooter}>
              <button className={modalStyles.cancelButton} onClick={onClose}>
                취소
              </button>
              {isVoted ? (
                <>
                  <div>
                    투표 결과:
                    {voteResult && voteResult.length > 0
                      ? voteResult.map((result, index) => (
                          <div key={index}>
                            {`투표 항목 ${result.choiceIndex + 1} : ${
                              result.voteCount
                            }표`}
                          </div>
                        ))
                      : "결과 없음"}
                  </div>
                  <button className={modalStyles.saveButton} onClick={onVote}>
                    다시 투표하기
                  </button>
                </>
              ) : (
                <button className={modalStyles.saveButton} onClick={onVote}>
                  투표하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    document.body
  );
};

export default PollModal;
