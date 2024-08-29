import React, { useState, useEffect } from 'react';
import styles from './HouseWork.module.css';
import Modal from 'react-modal';
import icon from '../../assets/images/icon-more.png';
import axios from 'axios';
import { useSelector } from 'react-redux';

// Modal의 app element 설정 (모달을 렌더링할 때 필요한 설정)
Modal.setAppElement('#root');

const HouseWork = () => {
    // 가족 구성원 리스트 (고정된 값)
    const familyMembers = ['모두함께', '엄마', '아빠', '아이'];

    // Redux에서 가져온 사용자 데이터
    const userData = useSelector((state) => state.user.userData);

    // 컴포넌트 내에서 사용하는 상태들
    const [dailyTasks, setDailyTasks] = useState([]); // 매일 할 일 목록
    const [shortTermTasks, setShortTermTasks] = useState([]); // 단기 작업 목록
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태
    const [taskType, setTaskType] = useState('daily'); // 작업 타입 (매일 할 일 또는 단기 작업)
    const [taskName, setTaskName] = useState(''); // 작업 이름
    const [taskNote, setTaskNote] = useState(''); // 작업 노트
    const [points, setPoints] = useState(0); // 총 포인트
    const [taskPoint, setTaskPoint] = useState(''); // 개별 작업의 포인트
    const [workUser, setWorkUser] = useState(''); // 담당자 선택
    const [warningMessages, setWarningMessages] = useState({ workUser: '', taskPoint: '' }); // 각 입력 필드의 경고 메시지

    const [dropdownOpen, setDropdownOpen] = useState(null); // 드롭다운 메뉴 열기/닫기 상태

    const [editTaskIndex, setEditTaskIndex] = useState(null); // 수정할 작업의 인덱스

    // 모달 열기 함수
    const openModal = () => setIsModalOpen(true);

    // 모달 닫기 및 입력 필드 초기화 함수
    const closeModal = () => {
        setIsModalOpen(false);
        setTaskName('');
        setTaskNote('');
        setTaskPoint('');
        setWorkUser('');
        setWarningMessages({ workUser: '', taskPoint: '' });
        setEditTaskIndex(null);
    };

    // 입력 필드 값 변경 처리 함수들
    const handleTaskTypeChange = (e) => setTaskType(e.target.value); // 작업 타입 변경
    const handleTaskNameChange = (e) => setTaskName(e.target.value); // 작업 이름 변경
    const handleTaskNoteChange = (e) => setTaskNote(e.target.value); // 작업 노트 변경
    const handleTaskPointChange = (e) => setTaskPoint(e.target.value); // 작업 포인트 변경
    const handleWorkUserChange = (e) => setWorkUser(e.target.value); // 담당자 선택 변경

    // 서버에서 작업 데이터를 가져오는 함수
    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:8089/wefam/get-works');
            const tasks = response.data;

            // 각 작업을 dailyTasks와 shortTermTasks로 분류
            const daily = tasks.filter(task => task.taskType === 'daily');
            const shortTerm = tasks.filter(task => task.taskType === 'shortTerm');

            setDailyTasks(daily);
            setShortTermTasks(shortTerm);

            // 총 포인트 계산
            const totalPoints = tasks.reduce((acc, task) => acc + task.points, 0);
            setPoints(totalPoints);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // 컴포넌트가 마운트될 때 작업을 불러옴
    useEffect(() => {
        fetchTasks();
    }, []);

    // 작업 추가 또는 수정 함수
    const addOrUpdateTask = async () => {
        let warnings = { workUser: '', taskPoint: '' };

        if (taskName.trim() === '') return;

        if (taskType === 'daily' && workUser.trim() === '') {
            warnings.workUser = '담당자를 선택해 주세요.';
        }

        if (taskPoint.trim() === '' || isNaN(taskPoint)) {
            warnings.taskPoint = '유효한 포인트를 입력해 주세요.';
        }

        // 경고 메시지가 있을 경우 작업을 중단하고 경고 메시지를 설정
        if (warnings.workUser || warnings.taskPoint) {
            setWarningMessages(warnings);
            return;
        }

        // 작업 객체 생성
        const task = {
            workIdx: editTaskIndex !== null ? editTaskIndex : null, // 수정 모드일 경우 기존 작업 인덱스 사용
            workTitle: taskName,
            workNote: taskNote,
            completed: false,
            workUser: workUser,
            points: parseInt(taskPoint), // 포인트를 숫자로 변환
            deadline: taskType === 'shortTerm' ? new Date().toISOString().split('T')[0] : null,
            taskType: taskType,
            familyIdx: 1,
            userId: userData ? userData.name : '', // userData가 존재할 경우에만 name을 가져옴
        };

        try {
            let response;

            if (editTaskIndex !== null) {
                // 수정 모드
                response = await axios.put(`http://localhost:8089/wefam/update-work/${task.workIdx}`, task);
                if (taskType === 'daily') {
                    setDailyTasks(dailyTasks.map(t =>
                        t.workIdx === response.data.workIdx ? response.data : t
                    ));
                } else {
                    setShortTermTasks(shortTermTasks.map(t =>
                        t.workIdx === response.data.workIdx ? response.data : t
                    ));
                }
            } else {
                // 새로운 작업 추가 모드
                response = await axios.post('http://localhost:8089/wefam/add-work', task);
                if (taskType === 'daily') {
                    setDailyTasks([...dailyTasks, response.data]);
                } else {
                    setShortTermTasks([...shortTermTasks, response.data]);
                }
            }

            closeModal();
        } catch (error) {
            console.error('Error adding or updating task:', error);
        }
    };

    // 작업 완료 상태 토글 함수
    const toggleTaskCompletion = async (taskList, setTaskList, index) => {
        const task = taskList[index];

        try {
            const updatedTask = { ...task, completed: !task.completed }; // 완료 상태 토글
            await axios.put(`http://localhost:8089/wefam/update-work/${task.workIdx}`, updatedTask);

            // 포인트 계산 및 업데이트
            const newPoints = updatedTask.completed ? points + task.points : points - task.points;
            setPoints(newPoints);

            setTaskList(taskList.map(t =>
                t.workIdx === task.workIdx ? updatedTask : t
            ));
        } catch (error) {
            console.error('Error updating task completion:', error);
        }
    };

    // 선택된 작업 삭제 함수
    const deleteSelectedTasks = async (index, taskType) => {
        try {
            const taskList = taskType === 'daily' ? dailyTasks : shortTermTasks;
            const taskToDelete = taskList[index];

            await axios.delete(`http://localhost:8089/wefam/delete-work/${taskToDelete.workIdx}`);

            const updatedTasks = taskList.filter(t => t.workIdx !== taskToDelete.workIdx);
            taskType === 'daily' ? setDailyTasks(updatedTasks) : setShortTermTasks(updatedTasks);

        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // 드롭다운 메뉴 토글 함수
    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    // 작업 수정 모드로 전환하는 함수
    const handleTaskEdit = (taskIndex, taskList, taskType) => {
        const task = taskList[taskIndex];

        setTaskName(task.workTitle);
        setTaskNote(task.workNote);
        setWorkUser(task.workUser);
        setTaskPoint(task.points.toString()); // 기존 포인트 설정
        setTaskType(taskType);
        setEditTaskIndex(task.workIdx);
        setIsModalOpen(true); // 모달 열기
    };

    // 모달 외부 클릭 시 드롭다운 메뉴 닫기 함수
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

                {/* 매일 할 일 섹션 */}
                <div className={styles.taskSection}>
                    <section>
                        <h3>매일 할 일</h3>
                        <ul>
                            {dailyTasks.map((task, index) => (
                                <li key={task.workIdx} className={task.completed ? styles.completed : ''}>
                                    <h4>{task.workUser} : {task.workTitle} - {task.workNote} - {task.points} 포인트</h4>
                                    <div className={styles.dropdownContainer}>
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => toggleTaskCompletion(dailyTasks, setDailyTasks, index)}
                                            className={styles.checkBox}
                                        />
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
                                                <button onClick={() => deleteSelectedTasks(index, 'daily')}>삭제</button>
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
                                <li key={task.workIdx} className={task.completed ? styles.completed : ''}>
                                    <h4>마감일: {task.deadline} - {task.workTitle} - {task.workNote} - {task.points} 포인트</h4>
                                    <div className={styles.dropdownContainer}>
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => toggleTaskCompletion(shortTermTasks, setShortTermTasks, index)}
                                            className={styles.checkBox}
                                        />
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
                                                <button onClick={() => deleteSelectedTasks(index, 'shortTerm')}>삭제</button>
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
                    {taskType === 'daily' && (
                        <div>
                            <select value={workUser} onChange={handleWorkUserChange}>
                                <option value="">담당자 선택</option>
                                {familyMembers.map((member, index) => (
                                    <option key={index} value={member}>{member}</option>
                                ))}
                            </select>
                            {warningMessages.workUser && <p className={styles.warningMessage}>{warningMessages.workUser}</p>}
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="유의사항"
                        value={taskNote}
                        onChange={handleTaskNoteChange}
                    />
                    <div>
                        <input
                            type="text"
                            placeholder="포인트(숫자만 적어주세요)"
                            value={taskPoint}
                            onChange={handleTaskPointChange}
                        />
                        {warningMessages.taskPoint && <p className={styles.warningMessage}>{warningMessages.taskPoint}</p>}
                    </div>
                    <div className={styles.houseworkModalButtonContainer}>
                        <button className={styles.houseworkModalButton} onClick={closeModal}>취소</button>
                        <button className={styles.houseworkModalButton} onClick={addOrUpdateTask}>
                            {editTaskIndex !== null ? '수정 완료' : '추가'}
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default HouseWork;
