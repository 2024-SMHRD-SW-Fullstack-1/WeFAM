import React, { useState, useEffect } from "react";
import styles from "./HouseWork.module.css";
import icon from "../../assets/images/icon-more.png";
import axios from "axios";
import { useSelector } from "react-redux";
import WorkModal from "./WorkModal";

const HouseWork = () => {
  // 할당 가능한 가족 구성원들 정의
  // const familyMembers = ["모두함께", "엄마", "아빠", "아이"];
  const [familyMembers, setFamilyMembers] = useState([]);


  // Redux 스토어에서 사용자 데이터 가져오기
  const userData = useSelector((state) => state.user.userData);

  // 상태 관리: 일일 작업, 단기 작업, 모달 열림 상태 등
  const [dailyTasks, setDailyTasks] = useState([]);
  const [shortTermTasks, setShortTermTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskType, setTaskType] = useState("daily");
  const [taskName, setTaskName] = useState("");
  const [taskNote, setTaskNote] = useState("");
  const [points, setPoints] = useState(0);
  const [taskPoint, setTaskPoint] = useState("");
  const [workUser, setWorkUser] = useState("");
  const [warningMessages, setWarningMessages] = useState({
    workUser: "",
    taskPoint: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editTaskIndex, setEditTaskIndex] = useState(null);

  // 모달 열기 함수
  const openModal = () => setIsModalOpen(true);

  // 모달 닫기 및 초기화 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setTaskName("");
    setTaskNote("");
    setTaskPoint("");
    setWorkUser("");
    setWarningMessages({ workUser: "", taskPoint: "" });
    setEditTaskIndex(null);
  };

  const handleTaskTypeChange = (e) => setTaskType(e.target.value);  // 작업 유형 변경 핸들러
  const handleTaskNameChange = (e) => setTaskName(e.target.value);  // 작업 이름 변경 핸들러
  const handleTaskNoteChange = (e) => setTaskNote(e.target.value);  // 작업 메모 변경 핸들러
  const handleTaskPointChange = (e) => setTaskPoint(e.target.value);// 작업 포인트 변경 핸들러
  const handleWorkUserChange = (e) => setWorkUser(e.target.value);  // 작업 담당자 변경 핸들러

  // 작업 데이터 가져오기 함수
  const fetchTasks = async () => {
    try {
      // 서버에서 작업 데이터 가져오기
      const response = await axios.get("http://localhost:8089/wefam/get-works");
      const tasks = response.data;

      // 일일 작업과 단기 작업으로 분류
      const daily = tasks.filter((task) => task.taskType === "daily");
      const shortTerm = tasks.filter((task) => task.taskType === "shortTerm");

      // 상태에 작업 데이터 설정
      setDailyTasks(daily);
      setShortTermTasks(shortTerm);

      // 총 포인트 계산
      const totalPoints = tasks.reduce((acc, task) => acc + task.points, 0);
      setPoints(totalPoints);
    } catch (error) {
      console.error("작업 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // 컴포넌트가 마운트될 때 작업 데이터 가져오기
  useEffect(() => {
    fetchTasks();
    
    // 회원 아이디 가져오기
    if (userData) {
      axios.get('http://localhost:8089/wefam/get-family')
        .then(response => {
          const loadedMembers = response.data.map(user => ({
            id: user.userId,
            name: user.name,
          }));
          setFamilyMembers(loadedMembers);
        })
        .catch(error => {
          console.log("회원아이디 가져오기 실패", error)
        });
    }
  }, [userData]);

  // 작업 추가 또는 수정 함수
  const addOrUpdateTask = async () => {
    let warnings = { workUser: "", taskPoint: "" };

    // 작업 이름이 비어있다면 종료
    if (taskName.trim() === "") return;

    // 일일 작업인데 담당자가 선택되지 않은 경우 경고 메시지 설정
    if (taskType === "daily" && workUser.trim() === "") {
      warnings.workUser = "담당자를 선택해 주세요.";
    }

    // 포인트가 유효하지 않은 경우 경고 메시지 설정
    if (taskPoint.trim() === "" || isNaN(taskPoint)) {
      warnings.taskPoint = "유효한 포인트를 입력해 주세요.";
    }

    // 경고 메시지가 있다면 상태에 설정하고 종료
    if (warnings.workUser || warnings.taskPoint) {
      setWarningMessages(warnings);
      return;
    }

    // 새로운 작업 객체 생성
    const task = {
      workIdx: editTaskIndex !== null ? editTaskIndex : null,
      workTitle: taskName,
      workNote: taskNote,
      completed: false,
      workUser: workUser,
      points: parseInt(taskPoint),
      deadline:
        taskType === "shortTerm"
          ? new Date().toISOString().split("T")[0]
          : null,
      taskType: taskType,
      familyIdx: 1,
      userId: userData ? userData.name : "",
    };

    try {
      let response;

      // 수정 모드라면 업데이트 요청
      if (editTaskIndex !== null) {
        response = await axios.put(
          `http://localhost:8089/wefam/update-work/${task.workIdx}`,
          task
        );
        if (taskType === "daily") {
          setDailyTasks(
            dailyTasks.map((t) =>
              t.workIdx === response.data.workIdx ? response.data : t
            )
          );
        } else {
          setShortTermTasks(
            shortTermTasks.map((t) =>
              t.workIdx === response.data.workIdx ? response.data : t
            )
          );
        }
      } else {
        // 새 작업 추가 요청
        response = await axios.post(
          "http://localhost:8089/wefam/add-work",
          task
        );
        if (taskType === "daily") {
          setDailyTasks([...dailyTasks, response.data]);
        } else {
          setShortTermTasks([...shortTermTasks, response.data]);
        }
      }

      // 모달 닫기 및 초기화
      closeModal();
    } catch (error) {
      console.error("작업 추가 또는 수정 중 오류 발생:", error);
    }
  };

  // 작업 완료 여부 토글 함수
  const toggleTaskCompletion = async (taskList, setTaskList, index) => {
    const task = taskList[index];

    try {
      // 작업 완료 상태 토글
      const updatedTask = { ...task, completed: !task.completed };
      await axios.put(
        `http://localhost:8089/wefam/update-work/${task.workIdx}`,
        updatedTask
      );

      // 포인트 업데이트
      const newPoints = updatedTask.completed
        ? points + task.points
        : points - task.points;
      setPoints(newPoints);

      // 상태 업데이트
      setTaskList(
        taskList.map((t) => (t.workIdx === task.workIdx ? updatedTask : t))
      );
    } catch (error) {
      console.error("작업 완료 상태 업데이트 중 오류 발생:", error);
    }
  };

  // 선택된 작업 삭제 함수
  const deleteSelectedTasks = async (index, taskType) => {
    try {
      const taskList = taskType === "daily" ? dailyTasks : shortTermTasks;
      const taskToDelete = taskList[index];

      // 작업 삭제 요청
      await axios.delete(
        `http://localhost:8089/wefam/delete-work/${taskToDelete.workIdx}`
      );

      // 상태에서 삭제된 작업 제거
      const updatedTasks = taskList.filter(
        (t) => t.workIdx !== taskToDelete.workIdx
      );
      taskType === "daily"
        ? setDailyTasks(updatedTasks)
        : setShortTermTasks(updatedTasks);
    } catch (error) {
      console.error("작업 삭제 중 오류 발생:", error);
    }
  };

  // 드롭다운 토글 함수
  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  // 작업 수정 모드 설정 함수
  const handleTaskEdit = (taskIndex, taskList, taskType) => {
    const task = taskList[taskIndex];

    // 수정할 작업의 데이터를 상태에 설정
    setTaskName(task.workTitle);
    setTaskNote(task.workNote);
    setWorkUser(task.workUser);
    setTaskPoint(task.points.toString());
    setTaskType(taskType);
    setEditTaskIndex(task.workIdx);
    setIsModalOpen(true);
  };

  // 외부 클릭 처리 함수: 드롭다운 닫기
  const handleOutsideClick = (e) => {
    if (!e.target.closest(`.${styles.dropdownContainer}`)) {
      setDropdownOpen(null);
    }
  };

  return (
    <div className="main" onClick={handleOutsideClick}>
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
            <h2>매일 할 일</h2>
            <ul>
              {dailyTasks.map((task, index) => (
                <li key={task.workIdx} className={styles.taskItem}>
                  <div className={styles.taskContent}>
                    <span className={styles.taskTitle}>{task.workTitle}</span>
                    <span className={styles.taskNote}>{task.workNote}</span>
                    <span className={styles.taskUser}>
                      담당자: {task.workUser}
                    </span>
                  </div>
                  <div className={styles.dropdownContainer}>
                    <div className={styles.taskRight}>
                      <div>
                        <input type="checkbox" />
                        <img
                          src={icon}
                          alt="task icon"
                          className={styles.taskIcon}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(`daily-${index}`);
                          }}
                        />
                      </div>
                      {dropdownOpen === `daily-${index}` && (
                        <div className={styles.dropdownMenu}>
                          <button
                            onClick={() =>
                              handleTaskEdit(index, dailyTasks, "daily")
                            }
                          >
                            수정
                          </button>
                          <button
                            onClick={() => deleteSelectedTasks(index, "daily")}
                          >
                            삭제
                          </button>
                        </div>
                      )}
                      <span className={styles.taskPoints}>
                        {task.points} 포인트
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className={styles.taskSection}>
          <section>
            <h2>오늘의 미션</h2>
            <ul>
              {shortTermTasks.map((task, index) => (
                <li key={task.workIdx} className={styles.taskItem}>
                  <div className={styles.taskContent}>
                    <span className={styles.taskTitle}>{task.workTitle}</span>
                    <span className={styles.taskNote}>{task.workNote}</span>
                    <span className={styles.taskUser}>
                      마감일: {task.deadline}
                    </span>
                  </div>

                  <div className={styles.dropdownContainer}>
                    <div className={styles.taskRight}>
                      <img
                        src={icon}
                        alt="task icon"
                        className={styles.taskIcon}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(`shortTerm-${index}`);
                        }}
                      />
                      {dropdownOpen === `shortTerm-${index}` && (
                        <div className={styles.dropdownMenu}>
                          <button
                            onClick={() =>
                              handleTaskEdit(index, shortTermTasks, "shortTerm")
                            }
                          >
                            수정
                          </button>
                          <button
                            onClick={() =>
                              deleteSelectedTasks(index, "shortTerm")
                            }
                          >
                            삭제
                          </button>
                        </div>
                      )}
                      <span className={styles.taskPoints}>
                        {task.points} 포인트
                      </span>
                    </div>
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

        <WorkModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          taskType={taskType}
          taskName={taskName}
          taskNote={taskNote}
          taskPoint={taskPoint}
          workUser={workUser}
          warningMessages={warningMessages}
          familyMembers={familyMembers}
          handleTaskTypeChange={handleTaskTypeChange}
          handleTaskNameChange={handleTaskNameChange}
          handleTaskNoteChange={handleTaskNoteChange}
          handleTaskPointChange={handleTaskPointChange}
          handleWorkUserChange={handleWorkUserChange}
          addOrUpdateTask={addOrUpdateTask}
          editTaskIndex={editTaskIndex}
        />
      </div>
    </div>
  );
};

export default HouseWork;
