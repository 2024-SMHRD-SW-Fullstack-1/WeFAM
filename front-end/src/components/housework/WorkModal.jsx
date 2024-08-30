import React from 'react';
import Modal from 'react-modal';
import { FiList, FiEdit, FiUser, FiAlertCircle } from 'react-icons/fi';
import { TbCoin } from "react-icons/tb";
import styles from './WorkModal.module.css';

Modal.setAppElement('#root');

const WorkModal = ({
    isModalOpen,
    closeModal,
    taskType,
    taskName,
    taskNote,
    taskPoint,
    workUser,
    warningMessages,
    familyMembers, // 여기서 전달된 familyMembers를 사용
    handleTaskTypeChange,
    handleTaskNameChange,
    handleTaskNoteChange,
    handleTaskPointChange,
    handleWorkUserChange,
    addOrUpdateTask,
    editTaskIndex
}) => {
    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="집안일 추가"
            className={styles.houseworkModal}
            overlayClassName={styles.houseworkOverlay}
        >
            <h2>{editTaskIndex !== null ? '집안일 수정' : '집안일 추가'}</h2>
            
            <div className={styles.inputContainer}>
                <FiList className={styles.icon} />
                <select value={taskType} onChange={handleTaskTypeChange}>
                    <option value="daily">매일 할 일</option>
                    <option value="shortTerm">오늘의 미션</option>
                </select>
            </div>

            <div className={styles.inputContainer}>
                <FiEdit className={styles.icon} />
                <input
                    type="text"
                    placeholder="할 일"
                    value={taskName}
                    onChange={handleTaskNameChange}
                />
            </div>

            {taskType === 'daily' && (
                <div className={styles.inputContainer}>
                    <FiUser className={styles.icon} />
                    <div style={{ width: '100%' }}>
                        <select value={workUser} onChange={handleWorkUserChange}>
                            <option value="">담당자 선택</option>
                            {familyMembers.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name}
                                </option>
                            ))}
                        </select>
                        {warningMessages.workUser && <p className={styles.warningMessage}>{warningMessages.workUser}</p>}
                    </div>
                </div>
            )}

            <div className={styles.inputContainer}>
                <FiAlertCircle className={styles.icon} />
                <input
                    type="text"
                    placeholder="유의사항"
                    value={taskNote}
                    onChange={handleTaskNoteChange}
                />
            </div>

            <div className={styles.inputContainer}>
                <TbCoin className={styles.icon} />
                <div style={{ width: '100%' }}>
                    <input
                        type="text"
                        placeholder="포인트(숫자만 적어주세요)"
                        value={taskPoint}
                        onChange={handleTaskPointChange}
                    />
                    {warningMessages.taskPoint && <p className={styles.warningMessage}>{warningMessages.taskPoint}</p>}
                </div>
            </div>

            <div className={styles.houseworkModalButtonContainer}>
                <button className={styles.houseworkModalButton} onClick={closeModal}>취소</button>
                <button className={styles.houseworkModalButton} onClick={addOrUpdateTask}>
                    {editTaskIndex !== null ? '수정 완료' : '추가'}
                </button>
            </div>
        </Modal>
    );
};

export default WorkModal;
