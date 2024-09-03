import React, { useState, useEffect } from "react";
import styles from "./HouseWork.module.css";
import icon from "../../assets/images/icon-more.png";
import axios from "axios";
import { useSelector } from "react-redux";
import WorkModal from "./WorkModal";

const HouseWork = () => {
  // Redux에서 familyMembers와 userData를 가져옵니다.
  const familyMembers = useSelector((state) => state.family.members);
  const userData = useSelector((state) => state.user.userData);

  // 상태 변수 선언: 가족 구성원 리스트, 작업 리스트, 모달 열림 상태 등
  const [localFamilyMembers, setFamilyMembers] = useState(familyMembers || []);
  const [tasks, setTasks] = useState({ daily: [], shortTerm: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskType, setTaskType] = useState("daily");
  const [taskName, setTaskName] = useState("");
  const [taskContent, setTaskContent] = useState("");
  const [taskPoint, setTaskPoint] = useState("");
  const [workUser, setWorkUser] = useState([]);
  const [warningMessages, setWarningMessages] = useState({
    workUser: "",
    taskPoint: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editTaskIndex, setEditTaskIndex] = useState(null);

  // 모달 열기 함수
  const openModal = () => setIsModalOpen(true);

  // 모달 닫기 및 상태 초기화 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setTaskName("");
    setTaskContent("");
    setTaskPoint("");
    setWorkUser([]);
    setWarningMessages({ workUser: "", taskPoint: "" });
    setEditTaskIndex(null);
  };

  // 작업 유형 변경 핸들러
  const handleTaskTypeChange = (e) => setTaskType(e.target.value);

  // 작업 이름 변경 핸들러
  const handleTaskNameChange = (e) => setTaskName(e.target.value);

  // 작업 내용 변경 핸들러
  const handleTaskContentChange = (e) => setTaskContent(e.target.value);

  // 작업 포인트 변경 핸들러
  const handleTaskPointChange = (e) => setTaskPoint(e.target.value);

  // 작업 담당자 변경 핸들러
  const handleWorkUserChange = (selectedUsers) => {
    setWorkUser(selectedUsers);
  };

  // 서버에서 작업 데이터를 가져오는 함수
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8089/wefam/get-works");
      const tasks = response.data;

      // 작업을 일일 작업과 단기 작업으로 분류하여 상태 업데이트
      setTasks({
        daily: tasks.filter((task) => task.taskType === "daily"),
        shortTerm: tasks.filter((task) => task.taskType === "shortTerm"),
      });
    } catch (error) {
      console.error("작업 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // 컴포넌트 마운트 시 작업 및 가족 구성원 데이터 가져오기
  useEffect(() => {
    fetchTasks();

    if (userData) {
      axios
        .get("http://localhost:8089/wefam/get-family")
        .then((response) => {
          const loadedMembers = response.data.map((user, index) => ({
            id: user.userId || index + 1, // userId가 없으면 index로 설정
            name: user.name,
          }));
          setFamilyMembers(loadedMembers);
        })
        .catch((error) => {
          console.log("회원아이디 가져오기 실패", error);
        });
    }
  }, [userData]);

  // 작업 추가 또는 수정 함수
  const addOrUpdateTask = async () => {
    let warnings = { workUser: "", taskPoint: "" };

    if (taskName.trim() === "") return;

    if (taskType === "daily" && workUser.length === 0) {
      warnings.workUser = "담당자를 선택해 주세요.";
    }

    if (taskPoint.trim() === "" || isNaN(taskPoint)) {
      warnings.taskPoint = "유효한 포인트를 입력해 주세요.";
    }

    if (warnings.workUser || warnings.taskPoint) {
      setWarningMessages(warnings);
      return;
    }

    const task = {
      workIdx: editTaskIndex !== null ? editTaskIndex : null,
      workTitle: taskName,
      workContent: taskContent,
      completed: false,
      userId: userData ? userData.id : "",
      points: parseInt(taskPoint),
      deadline:
        taskType === "shortTerm"
          ? new Date().toISOString().split(".")[0]
          : null,
      taskType: taskType,
      familyIdx: 1,
      workUserIds: workUser.map((user) => user.id).join(", "), // 담당자 ID 목록을 문자열로 전달
    };

    try {
      let response;
      if (editTaskIndex !== null) {
        response = await axios.put(
          `http://localhost:8089/wefam/update-work/${task.workIdx}`,
          task
        );
        updateTaskInState(response.data, taskType);
      } else {
        response = await axios.post(
          "http://localhost:8089/wefam/add-work",
          task
        );
        addTaskToState(response.data, taskType);
      }
      closeModal();
    } catch (error) {
      console.error("작업 추가 또는 수정 중 오류 발생:", error);
    }
  };

  // 상태에서 작업 업데이트 함수
  const updateTaskInState = (updatedTask, taskType) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [taskType]: prevTasks[taskType].map((task) =>
        task.workIdx === updatedTask.workIdx ? updatedTask : task
      ),
    }));
  };

  // 상태에 새 작업 추가 함수
  const addTaskToState = (newTask, taskType) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [taskType]: [...prevTasks[taskType], newTask],
    }));
  };

  // 작업 완료 상태 토글 함수
  const toggleTaskCompletion = async (taskList, setTaskList, index) => {
    const task = taskList[index];

    try {
      const updatedTask = { ...task, completed: !task.completed };
      await axios.put(
        `http://localhost:8089/wefam/update-work/${task.workIdx}`,
        updatedTask
      );

      setTaskList(
        taskList.map((t) => (t.workIdx === task.workIdx ? updatedTask : t))
      );
    } catch (error) {
      console.error("작업 완료 상태 업데이트 중 오류 발생:", error);
    }
  };

  // 작업 삭제 함수
  const deleteSelectedTasks = async (index, taskType) => {
    try {
      const taskList = tasks[taskType];
      const taskToDelete = taskList[index];

      await axios.delete(
        `http://localhost:8089/wefam/delete-work/${taskToDelete.workIdx}`
      );

      setTasks((prevTasks) => ({
        ...prevTasks,
        [taskType]: taskList.filter((t) => t.workIdx !== taskToDelete.workIdx),
      }));
    } catch (error) {
      console.error("작업 삭제 중 오류 발생:", error);
    }
  };

  // 드롭다운 메뉴 토글 함수
  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  // 작업 수정 모드 설정 함수
  const handleTaskEdit = (taskIndex, taskList, taskType) => {
    const task = taskList[taskIndex];

    setTaskName(task.workTitle);
    setTaskContent(task.workContent);
    setWorkUser(task.workUser.split(", "));
    setTaskPoint(task.points.toString());
    setTaskType(taskType);
    setEditTaskIndex(task.workIdx);
    setIsModalOpen(true);
  };

  // 외부 클릭 시 드롭다운 메뉴 닫기
  const handleOutsideClick = (e) => {
    if (!e.target.closest(`.${styles.dropdownContainer}`)) {
      setDropdownOpen(null);
    }
  };

  // 작업 리스트 렌더링 함수
  const renderTaskList = (tasks, taskType) => {
    const formatDateTime = (dateTime) => {
      if (!dateTime) return "";
      const date = new Date(dateTime);

      const formattedDate = date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return formattedDate;
    };

    return tasks.map((task, index) => (
      <li key={task.workIdx} className={styles.taskItem}>
        <div className={styles.taskContent}>
          <span className={styles.taskTitle}>{task.workTitle}</span>
          <span className={styles.taskContent}>{task.workContent}</span>
          {taskType === "daily" && task.participantNames ? (
            <span className={styles.taskUser}>
              담당자: {task.participantNames.join(", ")}
            </span>
          ) : (
            <span className={styles.taskUser}>
              마감일: {formatDateTime(task.deadline)}
            </span>
          )}
        </div>
        <div className={styles.dropdownContainer}>
          <div className={styles.taskRight}>
            <img
              src={icon}
              alt="task icon"
              className={styles.taskIcon}
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(`${taskType}-${index}`);
              }}
            />
            {dropdownOpen === `${taskType}-${index}` && (
              <div className={styles.dropdownMenu}>
                <button>미션 성공</button>
                <button onClick={() => handleTaskEdit(index, tasks, taskType)}>
                  수정
                </button>
                <button onClick={() => deleteSelectedTasks(index, taskType)}>
                  삭제
                </button>
              </div>
            )}
            <span className={styles.taskPoints}>{task.points} 포인트</span>
          </div>
        </div>
      </li>
    ));
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
        <div className={styles.workList}>
          <div className={styles.taskSection}>
            <section>
              <h2>매일 할 일</h2>
              <ul>{renderTaskList(tasks.daily, "daily")}</ul>
            </section>
          </div>

          <div className={styles.taskSection}>
            <section>
              <h2>오늘의 미션</h2>
              <ul>{renderTaskList(tasks.shortTerm, "shortTerm")}</ul>
            </section>
          </div>
        </div>

        <WorkModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          taskType={taskType}
          taskName={taskName}
          taskContent={taskContent}
          taskPoint={taskPoint}
          workUser={workUser}
          warningMessages={warningMessages}
          familyMembers={localFamilyMembers}
          handleTaskTypeChange={handleTaskTypeChange}
          handleTaskNameChange={handleTaskNameChange}
          handleTaskContentChange={handleTaskContentChange}
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
