import React, { useState, useEffect } from "react";
import styles from "./HouseWork2.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import WorkModal from "./WorkModal";
import { BsThreeDots, BsPlusCircle } from "react-icons/bs";

const HouseWork2 = () => {
  const familyMembers = useSelector((state) => state.family.members);
  const userData = useSelector((state) => state.user.userData);
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

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setTaskName("");
    setTaskContent("");
    setTaskPoint("");
    setWorkUser([]);
    setWarningMessages({ workUser: "", taskPoint: "" });
    setEditTaskIndex(null);
  };

  const handleTaskTypeChange = (e) => setTaskType(e.target.value);
  const handleTaskNameChange = (e) => setTaskName(e.target.value);
  const handleTaskContentChange = (e) => setTaskContent(e.target.value);
  const handleTaskPointChange = (e) => setTaskPoint(e.target.value);
  const handleWorkUserChange = (selectedUsers) => setWorkUser(selectedUsers);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8089/wefam/get-works");
      const tasks = response.data;
      setTasks({
        daily: tasks.filter((task) => task.taskType === "daily"),
        shortTerm: tasks.filter((task) => task.taskType === "shortTerm"),
      });
    } catch (error) {
      console.error("작업 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  console.log("gdgd", familyMembers);

  useEffect(() => {
    fetchTasks();
    if (userData) {
      axios
        .get("http://localhost:8089/wefam/get-family")
        .then((response) => {
          const loadedMembers = response.data.map((user, index) => ({
            id: user.userId || index + 1,
            name: user.name,
          }));
          setFamilyMembers(loadedMembers);
        })
        .catch((error) => {
          console.log("회원아이디 가져오기 실패", error);
        });
    }
  }, [userData]);

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
      workUserIds: workUser.map((user) => user.id).join(", "),
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

  const updateTaskInState = (updatedTask, taskType) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [taskType]: prevTasks[taskType].map((task) =>
        task.workIdx === updatedTask.workIdx ? updatedTask : task
      ),
    }));
  };

  const addTaskToState = (newTask, taskType) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [taskType]: [...prevTasks[taskType], newTask],
    }));
  };

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

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

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

  const handleOutsideClick = (e) => {
    if (!e.target.closest(`.${styles.dropdownContainer}`)) {
      setDropdownOpen(null);
    }
  };

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
          <br />
          <span className={styles.taskContent}>{task.workContent}</span>
          <br />
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
            <div className={styles.taskContainer}>
              <BsThreeDots
                className={styles.taskIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(`${taskType}-${index}`);
                }}
              />
              <span className={styles.taskPoints}>{task.points} 포인트</span>
            </div>
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
          </div>
        </div>
      </li>
    ));
  };

  return (
    <div className='main' onClick={handleOutsideClick}>
      <div styles={styles.gridContainer}>
        <div className={styles.board}>
          <div className={styles.column}>
            <div className={styles.column_header}>
              <h3>매일 할 일</h3>
              <span
                className={tasks.daily.length > 0 ? styles.circleDaily : ""}>
                {tasks.daily.length}
              </span>
              <div className={styles.add_task} onClick={openModal}>
                <BsPlusCircle
                  styles={styles.icon}
                  style={{ color: "#e74c3c", fontSize: "24px" }}
                />
              </div>
            </div>
            <ul className={styles.taskList}>
              {renderTaskList(tasks.daily, "daily")}
            </ul>
          </div>

          <div className={styles.column}>
            <div className={styles.column_header}>
              <h3>오늘의 미션</h3>
              <span
                className={
                  tasks.shortTerm.length > 0 ? styles.circleShortTerm : ""
                }>
                {tasks.shortTerm.length}
              </span>
              <div className={styles.add_task} onClick={openModal}>
                <BsPlusCircle
                  styles={styles.icon}
                  style={{ color: "#ff9203", fontSize: "24px" }}
                />
              </div>
            </div>
            <ul className={styles.taskList}>
              {renderTaskList(tasks.shortTerm, "shortTerm")}
            </ul>
          </div>
        </div>
      </div>
      <div styles={styles.board}>
        <div className={styles.column_header}>
          <h3>매일 할 일</h3>
          <span className={tasks.daily.length > 0 ? styles.circleDaily : ""}>
            {tasks.daily.length}
          </span>
          <div className={styles.add_task} onClick={openModal}>
            <BsPlusCircle
              styles={styles.icon}
              style={{ color: "#e74c3c", fontSize: "24px" }}
            />
          </div>
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
  );
};

export default HouseWork2;
