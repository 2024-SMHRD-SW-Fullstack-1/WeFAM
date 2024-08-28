import React, { useState } from 'react';
import styles from './HouseWork.module.css';
import Modal from 'react-modal';
import icon from '../../assets/images/icon-more.png';
import axios from 'axios';

// 가족 구성원 리스트
const familyMembers = ['모두함께', '엄마', '아빠', '아이'];

// Modal의 app element 설정
Modal.setAppElement('#root');

const HouseWork = () => {
    const [dailyTasks, setDailyTasks] = useState([]);
    const [shortTermTasks, setShortTermTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskType, setTaskType] = useState('daily');
    const [taskName, setTaskName] = useState('');
    const [taskNote, setTaskNote] = useState('');
    const [points, setPoints] = useState(0);
    const [assignedMember, setAssignedMember] = useState('');
    const [selectedTasks, setSelectedTasks] = useState(new Set());
    const [warningMessage, setWarningMessage] = useState('');

    const [dropdownOpen, setDropdownOpen] = useState(null);

    // 수정 모드인지, 수정할 항목의 인덱스 상태 관리
    const [editTaskIndex, setEditTaskIndex] = useState(null);
    const [editTaskType, setEditTaskType] = useState(null);

    // 모달 열기
    const openModal = () => setIsModalOpen(true);

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setTaskName('');
        setTaskNote('');
        setAssignedMember('');
        setWarningMessage('');
        setEditTaskIndex(null); // 수정 모드 상태 초기화
        setEditTaskType(null); // 수정 모드 상태 초기화
    };

    // 입력 필드 값 변경 처리
    const handleTaskTypeChange = (e) => setTaskType(e.target.value);
    const handleTaskNameChange = (e) => setTaskName(e.target.value);
    const handleTaskNoteChange = (e) => setTaskNote(e.target.value);
    const handleAssignedMemberChange = (e) => setAssignedMember(e.target.value);

    // 작업 추가 또는 수정
    const addOrUpdateTask = async () => {
        if (taskName.trim() === '') return;
        if (taskType === 'daily' && assignedMember.trim() === '') {
            setWarningMessage('담당자를 선택해 주세요.');
            return;
        }

        const task = {
            workIdx: editTaskIndex !== null ? editTaskIndex : null, // 수정 모드 시 workIdx 포함
            workTitle: taskName,
            workNote: taskNote,
            completed: false,
            assignedTo: assignedMember,
            points: taskType === 'daily' ? 10 : 20,
            deadline: taskType === 'shortTerm' ? new Date().toISOString().split('T')[0] : null,
            taskType: taskType,
            familyIdx: 1,
            userId: 'test'
        };

        try {
            let response;
            if (editTaskIndex !== null) {
                response = await axios.put(`/wefam/update-work/${editTaskIndex}`, task); // 수정 요청 (PUT)
            } else {
                response = await axios.post('/wefam/add-work', task); // 추가 요청 (POST)
            }

            console.log('Task added/updated:', response.data);

            if (editTaskIndex !== null) {
                // 수정된 항목을 프론트엔드 상태에서 업데이트
                if (editTaskType === 'daily') {
                    const updatedTasks = dailyTasks.map((t, index) =>
                        index === editTaskIndex ? { ...t, ...task } : t
                    );
                    setDailyTasks(updatedTasks);
                } else {
                    const updatedTasks = shortTermTasks.map((t, index) =>
                        index === editTaskIndex ? { ...t, ...task } : t
                    );
                    setShortTermTasks(updatedTasks);
                }
            } else {
                if (taskType === 'daily') {
                    setDailyTasks([...dailyTasks, task]);
                } else {
                    setShortTermTasks([...shortTermTasks, task]);
                }
            }

            closeModal();
        } catch (error) {
            console.error('Error adding or updating task:', error);
            // 에러 처리
        }
    };


    // 작업 완료 상태 토글
    const toggleTaskCompletion = async (taskList, setTaskList, index) => {
        const newTasks = [...taskList];
        const task = newTasks[index];

        try {
            const updatedTask = { ...task, completed: !task.completed };
            await axios.put(`/wefam/update-work/${task.workIdx}`, updatedTask);

            task.completed = !task.completed;

            if (task.completed) {
                setPoints(points + task.points);
            } else {
                setPoints(points - task.points);
            }

            setTaskList(newTasks);
        } catch (error) {
            console.error('Error updating task completion:', error);
            // 에러 처리
        }
    };


    // 선택된 작업 토글
    const handleTaskSelect = (taskIndex) => {
        const newSelectedTasks = new Set(selectedTasks);

        if (newSelectedTasks.has(taskIndex)) {
            newSelectedTasks.delete(taskIndex);
        } else {
            newSelectedTasks.add(taskIndex);
        }
        setSelectedTasks(newSelectedTasks);
    };


    // 선택된 작업 삭제
    const deleteSelectedTasks = async (taskList, setTaskList) => {
        const tasksToDelete = Array.from(selectedTasks).map(index => taskList[index].workIdx);

        try {
            await axios.delete('/wefam/delete-works', { data: { ids: tasksToDelete } });

            const newTasks = taskList.filter((_, index) => !selectedTasks.has(index));
            setTaskList(newTasks);
            setSelectedTasks(new Set());
        } catch (error) {
            console.error('Error deleting tasks:', error);
            // 에러 처리
        }
    };


    // 드롭다운 메뉴 토글
    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    // 작업 수정
    const handleTaskEdit = (taskIndex, taskList, taskType) => {
        const task = taskList[taskIndex];
        setTaskName(task.workTitle);
        setTaskNote(task.workNote);
        setAssignedMember(task.assignedTo);
        setTaskType(taskType);
        setEditTaskIndex(taskIndex);
        setEditTaskType(taskType);
        setIsModalOpen(true);
    };

    // 모달 외부 클릭 처리
    const handleOutsideClick = (e) => {
        if (!e.target.closest(`.${styles.dropdownContainer}`)) {
            setDropdownOpen(null);
        }
    };

    return (
        <div className='main' onClick={handleOutsideClick}>
            <div className={styles.houseworkContainer}>
                <div className={styles.houseworkTitle}>
                    <h1>집안일 관리</h1>
                    <div>
                        <button className={styles.addButton} onClick={openModal}>
                            집안일 추가
                        </button>
                    </div>
                </div>

                <div className={styles.taskSection}>
                    <section>
                        <h3>매일 할 일</h3>
                        <ul>
                            {dailyTasks.map((task, index) => (
                                <li key={index} className={task.completed ? styles.completed : ''}>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTaskCompletion(dailyTasks, setDailyTasks, index)}
                                        className={styles.checkBox}
                                    />
                                    <h4>{task.assignedTo} : {task.workTitle} - {task.workNote} - {task.points} 포인트</h4>
                                    <div className={styles.dropdownContainer}>
                                        <img
                                            src={icon}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDropdown(`daily-${index}`);
                                            }}
                                            className={styles.imgIcon}
                                        />
                                        {dropdownOpen === `daily-${index}` && (
                                            <div className={styles.dropdownMenu}>
                                                <button onClick={() => handleTaskEdit(index, dailyTasks, 'daily')}>수정</button>
                                                <button onClick={() => deleteSelectedTasks(dailyTasks, setDailyTasks)}>삭제</button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className={styles.taskSection}>
                    <section>
                        <h3>오늘의 미션</h3>
                        <ul>
                            {shortTermTasks.map((task, index) => (
                                <li key={index} className={task.completed ? styles.completed : ''}>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTaskCompletion(shortTermTasks, setShortTermTasks, index)}
                                        className={styles.checkBox}
                                    />
                                    <h4>마감일: {task.deadline} - {task.workTitle} - {task.workNote} - {task.points} 포인트</h4>
                                    <div className={styles.dropdownContainer}>
                                        <img
                                            src={icon}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDropdown(`shortTerm-${index}`);
                                            }}
                                            className={styles.imgIcon}
                                        />
                                        {dropdownOpen === `shortTerm-${index}` && (
                                            <div className={styles.dropdownMenu}>
                                                <button onClick={() => handleTaskEdit(index, shortTermTasks, 'shortTerm')}>수정</button>
                                                <button onClick={() => deleteSelectedTasks(shortTermTasks, setShortTermTasks)}>삭제</button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className={styles.points}>
                    <h3>총 포인트: {points}점</h3>
                    <p>포인트로 소원권 등 다양한 보상을 받을 수 있습니다.</p>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="집안일 추가"
                    className={styles.houseworkModal}
                    overlayClassName={styles.houseworkOverlay}
                >
                    <h2>{editTaskIndex !== null ? '집안일 수정' : '집안일 추가'}</h2>
                    <select value={taskType} onChange={handleTaskTypeChange}>
                        <option value="daily">매일 할 일</option>
                        <option value="shortTerm">오늘의 미션</option>
                    </select>
                    <input
                        type="text"
                        placeholder="할 일"
                        value={taskName}
                        onChange={handleTaskNameChange}
                    />
                    <input
                        type="text"
                        placeholder="노트"
                        value={taskNote}
                        onChange={handleTaskNoteChange}
                    />
                    {taskType === 'daily' && (
                        <select value={assignedMember} onChange={handleAssignedMemberChange}>
                            <option value="">담당자 선택</option>
                            {familyMembers.map((member, index) => (
                                <option key={index} value={member}>{member}</option>
                            ))}
                        </select>
                    )}
                    {warningMessage && <p className={styles.warningMessage}>{warningMessage}</p>}
                    <button className={styles.houseworkModalButton} onClick={addOrUpdateTask}>
                        {editTaskIndex !== null ? '수정 완료' : '추가'}
                    </button>
                    <button className={styles.houseworkModalButton} onClick={closeModal}>취소</button>
                </Modal>
            </div>
        </div>
    );
};

export default HouseWork;
