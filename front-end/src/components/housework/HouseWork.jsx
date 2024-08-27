import React, { useState } from 'react';
import styles from './HouseWork.module.css'; // CSS 모듈 임포트
import Modal from 'react-modal'; // Modal 컴포넌트 임포트

// 집안일을 배정할 가족 구성원 목록
const familyMembers = ['모두함께', '엄마', '아빠', '아이'];

Modal.setAppElement('#root'); // 모달 접근성을 위한 설정

const HouseWork = () => {
    // 상태 관리 훅
    const [dailyTasks, setDailyTasks] = useState([]); // 매일 반복해야 할 집안일 목록
    const [shortTermTasks, setShortTermTasks] = useState([]); // 단기적으로 해야 할 집안일 목록
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
    const [taskType, setTaskType] = useState('daily'); // 집안일 유형 (매일/단기)
    const [taskName, setTaskName] = useState(''); // 집안일 이름
    const [points, setPoints] = useState(0); // 총 포인트
    const [assignedMember, setAssignedMember] = useState(''); // 집안일 담당자
    const [selectedTasks, setSelectedTasks] = useState(new Set()); // 선택된 집안일
    const [warningMessage, setWarningMessage] = useState(''); // 경고 메시지 상태


    // 모달 열기
    const openModal = () => {
        setIsModalOpen(true);
    };

    // 모달 닫기 및 폼 초기화
    const closeModal = () => {
        setIsModalOpen(false);
        setTaskName('');
        setAssignedMember('');
        setWarningMessage('');
    };

    // 집안일 유형 변경 핸들러
    const handleTaskTypeChange = (e) => {
        setTaskType(e.target.value);
    };

    // 집안일 이름 변경 핸들러
    const handleTaskNameChange = (e) => {
        setTaskName(e.target.value);
    };

    // 담당자 변경 핸들러
    const handleAssignedMemberChange = (e) => {
        setAssignedMember(e.target.value);
    };

    // 집안일 추가 함수
    const addTask = () => {
        if (taskName.trim() === '') return; // 집안일 이름이 비어있으면 추가하지 않음

        // 담당자가 필요한 경우 체크
        if (taskType === 'daily' && assignedMember.trim() === '') {
            setWarningMessage('담당자를 선택해 주세요.'); // 경고 메시지 설정
            return;
        }

        // 새로운 집안일 객체 생성
        const task = {
            name: taskName,
            completed: false, // 초기 상태는 미완료
            assignedTo: assignedMember, // 담당자
            points: taskType === 'daily' ? 10 : 20, // 포인트 할당: 반복 작업 10점, 단기 작업 20점
            deadline: taskType === 'shortTerm' ? new Date().toLocaleDateString() : null, // 단기 작업의 마감일 설정
        };

        // 선택한 집안일 유형에 따라 적절한 목록에 추가
        if (taskType === 'daily') {
            setDailyTasks([...dailyTasks, task]);
        } else {
            setShortTermTasks([...shortTermTasks, task]);
        }

        closeModal(); // 모달 닫기
    };

    // 집안일 완료 상태 토글 함수
    const toggleTaskCompletion = (taskList, setTaskList, index) => {
        const newTasks = [...taskList];
        const task = newTasks[index];

        if (!task.completed) {
            setPoints(points + task.points); // 포인트 추가
        }

        task.completed = !task.completed; // 완료 상태 토글
        setTaskList(newTasks);
    };

    // 선택된 집안일 상태 토글
    const handleTaskSelect = (taskIndex, taskList, setTaskList) => {
        const newSelectedTasks = new Set(selectedTasks);
        if (newSelectedTasks.has(taskIndex)) {
            newSelectedTasks.delete(taskIndex);
        } else {
            newSelectedTasks.add(taskIndex);
        }
        setSelectedTasks(newSelectedTasks);
    };

    // 선택된 집안일 삭제 함수
    const deleteSelectedTasks = () => {
        // 선택된 집안일 제거
        const newDailyTasks = dailyTasks.filter((_, index) => !selectedTasks.has(index));
        const newShortTermTasks = shortTermTasks.filter((_, index) => !selectedTasks.has(index));

        setDailyTasks(newDailyTasks);
        setShortTermTasks(newShortTermTasks);
        setSelectedTasks(new Set()); // 선택된 항목 초기화
    };

    return (
        <div className='main'>
            <div className={styles.houseworkContainer}>
                {/* 제목과 추가 버튼 */}
                <div className={styles.houseworkTitle}>
                    <h1>집안일 관리</h1>
                    <div>
                        <button className={styles.deleteButton} onClick={deleteSelectedTasks}>
                            집안일 삭제
                        </button>
                        <button className={styles.addButton} onClick={openModal}>
                            집안일 추가
                        </button>
                    </div>
                </div>

                {/* 매일 반복해야 할 집안일 목록 */}
                <div className={styles.taskSection}>
                    <section>
                        <h3>매일 할 일</h3>
                        <ul>
                            {dailyTasks.map((task, index) => (
                                <li key={index} className={task.completed ? styles.completed : ''}>
                                    <input
                                        type="checkbox"
                                        checked={selectedTasks.has(index)}
                                        onChange={() => handleTaskSelect(index, dailyTasks, setDailyTasks)}
                                        className={styles.checkBox}
                                    />
                                    <h4>{task.assignedTo} : {task.name} - {task.points} 포인트</h4>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTaskCompletion(dailyTasks, setDailyTasks, index)}
                                        className={styles.checkBox}
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* 단기적으로 해야 할 집안일 목록 */}
                <div className={styles.taskSection}>
                    <section>
                        <h3>오늘의 미션</h3>
                        <ul>
                            {shortTermTasks.map((task, index) => (
                                <li key={index} className={task.completed ? styles.completed : ''}>
                                    <input
                                        type="checkbox"
                                        checked={selectedTasks.has(index)}
                                        onChange={() => handleTaskSelect(index, shortTermTasks, setShortTermTasks)}
                                        className={styles.checkBox}
                                    />
                                    <h4>마감일: {task.deadline} - {task.name} - {task.points} 포인트</h4>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTaskCompletion(shortTermTasks, setShortTermTasks, index)}
                                        className={styles.checkBox}
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* 총 포인트 표시 */}
                <div className={styles.points}>
                    <h3>총 포인트: {points}점</h3>
                    <p>포인트로 소원권 등 다양한 보상을 받을 수 있습니다.</p>
                </div>

                {/* 집안일 추가 모달 */}
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="집안일 추가"
                    className={styles.houseworkModal}
                    overlayClassName={styles.houseworkOverlay}
                >
                    <h2>집안일 추가</h2>
                    <select value={taskType} onChange={handleTaskTypeChange}>
                        <option value="daily">매일 할 일</option>
                        <option value="shortTerm">오늘의 미션</option>
                    </select>
                    <input
                        type="text"
                        placeholder="집안일 이름"
                        value={taskName}
                        onChange={handleTaskNameChange}
                    />
                    {taskType === 'daily' && (
                        <select value={assignedMember} onChange={handleAssignedMemberChange}>
                            <option value="">담당자 선택</option>
                            {familyMembers.map((member, index) => (
                                <option key={index} value={member}>
                                    {member}
                                </option>
                            ))}
                        </select>
                    )}
                    {warningMessage && <p className={styles.warningMessage}>{warningMessage}</p>}
                    <button className={styles.houseworkModalButton} onClick={addTask}>
                        추가
                    </button>
                    <button className={styles.houseworkModalButton} onClick={closeModal}>
                        취소
                    </button>
                </Modal>
            </div>
        </div>
    );
};

export default HouseWork;
