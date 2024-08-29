import React, { useState, useEffect } from 'react';
import styles from './HouseWork.module.css';
import Modal from 'react-modal';
import icon from '../../assets/images/icon-more.png';
import axios from 'axios';

// 가족 구성원 리스트
const familyMembers = ['모두함께', '엄마', '아빠', '아이'];

// Modal의 app element 설정
Modal.setAppElement('#root');

const HouseWork = () => {
    // 상태 관리
    const [dailyTasks, setDailyTasks] = useState([]); // 매일 할 일 목록
    const [shortTermTasks, setShortTermTasks] = useState([]); // 단기 작업 목록
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태
    const [taskType, setTaskType] = useState('daily'); // 작업 타입 (매일 할 일 또는 단기 작업)
    const [taskName, setTaskName] = useState(''); // 작업 이름
    const [taskNote, setTaskNote] = useState(''); // 작업 노트
    const [points, setPoints] = useState(0); // 총 포인트
    const [assignedMember, setAssignedMember] = useState(''); // 담당자 선택
    const [warningMessage, setWarningMessage] = useState(''); // 경고 메시지

    const [dropdownOpen, setDropdownOpen] = useState(null); // 드롭다운 메뉴 열기/닫기 상태

    // 수정 모드인지, 수정할 항목의 인덱스 상태 관리
    const [editTaskIndex, setEditTaskIndex] = useState(null); // 수정할 작업의 인덱스
    const [editTaskType, setEditTaskType] = useState(null); // 수정할 작업의 타입

    // 모달 열기
    const openModal = () => setIsModalOpen(true);

    // 모달 닫기 및 초기화
    const closeModal = () => {
        setIsModalOpen(false);
        setTaskName('');
        setTaskNote('');
        setAssignedMember('');
        setWarningMessage('');
        setEditTaskIndex(null); // 수정 모드 상태 초기화
        setEditTaskType(null); // 수정 모드 상태 초기화
    };

    // 입력 필드 값 변경 처리 함수들
    const handleTaskTypeChange = (e) => setTaskType(e.target.value); // 작업 타입 변경
    const handleTaskNameChange = (e) => setTaskName(e.target.value); // 작업 이름 변경
    const handleTaskNoteChange = (e) => setTaskNote(e.target.value); // 작업 노트 변경
    const handleAssignedMemberChange = (e) => setAssignedMember(e.target.value); // 담당자 선택 변경

    // 서버에서 작업을 가져오는 함수
    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:8089/wefam/get-works');
            const tasks = response.data;

            // 각 작업을 dailyTasks와 shortTermTasks로 분류
            const daily = tasks.filter(task => task.taskType === 'daily');
            const shortTerm = tasks.filter(task => task.taskType === 'shortTerm');

            setDailyTasks(daily);
            setShortTermTasks(shortTerm);

            // 포인트 계산
            const totalPoints = tasks.reduce((acc, task) => acc + task.points, 0);
            setPoints(totalPoints);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // 컴포넌트 마운트 시 작업을 불러옴
    useEffect(() => {
        fetchTasks();
    }, []);

    // 작업 추가 또는 수정
    const addOrUpdateTask = async () => {
        // 작업 이름이 비어 있으면 작업하지 않음
        if (taskName.trim() === '') return;

        // 매일 할 일인데 담당자가 선택되지 않은 경우 경고 메시지 표시
        if (taskType === 'daily' && (assignedMember && assignedMember.trim() === '')) {
            setWarningMessage('담당자를 선택해 주세요.');
            return;
        }

        // 작업 객체 생성
        const task = {
            workIdx: editTaskIndex !== null ? editTaskIndex : null,
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

            // 수정 모드일 때
            if (editTaskIndex !== null) {
                response = await axios.put(`http://localhost:8089/wefam/update-work/${editTaskIndex}`, task);
                console.log('Task updated:', response.data);

                // 수정된 작업 상태 업데이트
                if (taskType === 'daily') {
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
                // 새로운 작업 추가 모드일 때
                response = await axios.post('http://localhost:8089/wefam/add-work', task);
                console.log('Task added:', response.data);

                if (taskType === 'daily') {
                    setDailyTasks([...dailyTasks, task]);
                } else {
                    setShortTermTasks([...shortTermTasks, task]);
                }
            }

            closeModal(); // 작업 후 모달 닫기
        } catch (error) {
            console.error('Error adding or updating task:', error);
        }
    };

    // 작업 완료 상태 토글
    const toggleTaskCompletion = async (taskList, setTaskList, index) => {
        const newTasks = [...taskList]; // 작업 리스트 복사
        const task = newTasks[index]; // 해당 작업 선택

        try {
            const updatedTask = { ...task, completed: !task.completed }; // 완료 상태 토글
            await axios.put(`http://localhost:8089/wefam/update-work/${task.workIdx}`, updatedTask); // 서버에 업데이트 요청

            task.completed = !task.completed; // 상태 업데이트

            // 포인트 계산
            if (task.completed) {
                setPoints(points + task.points);
            } else {
                setPoints(points - task.points);
            }

            setTaskList(newTasks); // 업데이트된 리스트로 상태 갱신
        } catch (error) {
            console.error('Error updating task completion:', error);
        }
    };

    // 선택된 작업 삭제
    const deleteSelectedTasks = async (index, taskType) => {
        try {
            const taskList = taskType === 'daily' ? dailyTasks : shortTermTasks; // 작업 리스트 선택
            const taskToDelete = taskList[index]; // 삭제할 작업 선택

            // 서버에서 작업 삭제 요청
            await axios.delete(`http://localhost:8089/wefam/delete-work/${taskToDelete.workIdx}`);

            // 업데이트된 작업 리스트
            const updatedTasks = taskList.filter((_, i) => i !== index);
            taskType === 'daily' ? setDailyTasks(updatedTasks) : setShortTermTasks(updatedTasks);

            console.log(`Task ${index} deleted successfully`);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // 드롭다운 메뉴 토글
    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index); // 드롭다운 열기/닫기 토글
    };

    // 작업 수정
    const handleTaskEdit = (taskIndex, taskList, taskType) => {
        const task = taskList[taskIndex]; // 수정할 작업 선택
        setTaskName(task.workTitle); // 작업 이름 설정
        setTaskNote(task.workNote); // 작업 노트 설정
        setAssignedMember(task.assignedTo); // 담당자 설정
        setTaskType(taskType); // 작업 타입 설정
        setEditTaskIndex(taskIndex); // 수정 모드에서 작업 인덱스 설정
        setEditTaskType(taskType); // 수정 모드에서 작업 타입 설정
        setIsModalOpen(true); // 모달 열기
    };

    // 모달 외부 클릭 처리
    const handleOutsideClick = (e) => {
        if (!e.target.closest(`.${styles.dropdownContainer}`)) { // 드롭다운 외부 클릭 시 닫기
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

                {/* 매일 할 일 섹션 */}
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
                                                <button onClick={() => deleteSelectedTasks(index, taskType)}>삭제</button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* 오늘의 미션 섹션 */}
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
                                                <button onClick={() => deleteSelectedTasks(index, taskType)}>삭제</button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* 포인트 섹션 */}
                <div className={styles.points}>
                    <h3>총 포인트: {points}점</h3>
                    <p>포인트로 소원권 등 다양한 보상을 받을 수 있습니다.</p>
                </div>

                {/* 작업 추가/수정 모달 */}
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
