import React, { useState, useEffect } from "react";
import styles from "./Housework2.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import WorkModal from "./WorkModal";
import CompleteModal from "./CompleteModal";
import { BsThreeDots, BsPlusCircle } from "react-icons/bs";

const Housework2 = () => {
  const userData = useSelector((state) => state.user.userData);

  const [localFamilyMembers, setFamilyMembers] = useState([]); // 초기값을 빈 배열로 설정
  const [tasks, setTasks] = useState({ daily: [], shortTerm: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskType, setTaskType] = useState("daily"); // 작업 유형을 구분하는 상태값
  const [taskName, setTaskName] = useState("");
  const [taskContent, setTaskContent] = useState("");
  const [taskPoint, setTaskPoint] = useState("");
  const [workUser, setWorkUser] = useState([]);
  const [participantNames, setParticipantNames] = useState([]);
  const [warningMessages, setWarningMessages] = useState({
    workUser: "",
    taskPoint: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(null); // 드롭다운 토글 상태
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false); // 완료 모달 상태 추가
  const [selectedTask, setSelectedTask] = useState(null); // 완료하려는 작업 선택
  const [selectedFiles, setSelectedFiles] = useState([]); // 이미지 파일을 저장할 상태

  // 매일 할 일 모달을 여는 함수
  const openDailyModal = () => {
    setTaskType("daily"); // taskType을 daily로 설정
    openModal();
  };

  // 오늘의 미션 모달을 여는 함수
  const openShortTermModal = () => {
    setTaskType("shortTerm"); // taskType을 shortTerm으로 설정
    openModal();
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setTaskName("");
    setTaskContent("");
    setTaskPoint("");
    setWorkUser([]);
    setParticipantNames([]);
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

  useEffect(() => {
    fetchTasks();
    const fetchFamilyMembers = async () => {
      if (userData) {
        try {
          const response = await axios.get(
            `http://localhost:8089/wefam/get-family-members/${userData.id}`
          );
          const members = response.data.map((member) => ({
            id: member.userId,
            name: member.name,
          }));
          setFamilyMembers(members);
        } catch (error) {
          console.error("가족 구성원 정보를 불러오는 중 오류 발생:", error);
        }
      }
    };

    fetchFamilyMembers();
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
      workUserIds:
        taskType === "daily" && workUser.length > 0
          ? workUser.map((user) => user.id)
          : [],
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
      fetchTasks();
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

      fetchTasks();
    } catch (error) {
      console.error("작업 삭제 중 오류 발생:", error);
    }
  };

  // 미션 완료 모달 열기
  const handleMissionComplete = (task) => {
    setSelectedTask(task); // 완료하려는 작업 설정
    setIsCompleteModalOpen(true); // 완료 모달 열기
  };

  // 작업 완료 처리
  // const handleCompleteConfirm = async () => {
  //   if (selectedTask) {
  //     const formData = new FormData();

  //     // 이미지 파일들을 FormData에 추가
  //     selectedFiles.forEach((file) => {
  //       formData.append("images", file); // 'images'라는 키로 파일 추가
  //       formData.append("fileNames", file.name); // 파일명
  //       formData.append("fileExtensions", file.name.split(".").pop()); // 확장자
  //       formData.append("fileSizes", file.size); // 파일 크기
  //     });

  //     // 추가로 필요한 데이터
  //     formData.append("workIdx", selectedTask.workIdx); // 작업의 ID를 workIdx로 설정
  //     formData.append("familyIdx", userData.familyIdx); // 사용자 familyIdx
  //     formData.append("userId", userData.id); // 로그인된 사용자의 ID
  //     formData.append("completed", true); // 작업 완료 여부 전달

  //     try {
  //       const response = await fetch(
  //         "http://localhost:8089/wefam/complete-with-files", // 파일과 작업 완료 처리 백엔드 엔드포인트
  //         {
  //           method: "POST",
  //           body: formData,
  //         }
  //       );

  //       if (response.ok) {
  //         const result = await response.json();
  //         alert("작업 완료 및 이미지 저장이 완료되었습니다.");
  //         fetchTasks(); // 작업 목록 갱신
  //         setIsCompleteModalOpen(false); // 모달 닫기
  //       } else {
  //         console.error("서버 오류:", response.statusText);
  //       }
  //     } catch (error) {
  //       console.error("작업 완료 및 이미지 저장 중 오류 발생:", error);
  //     }
  //   }
  // };


  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleTaskEdit = (taskIndex, taskList, taskType) => {
    const task = taskList[taskIndex];

    setTaskName(task.workTitle);
    setTaskContent(task.workContent);

    if (typeof task.participantNames === "string") {
      setWorkUser(task.participantNames.split(", "));
    } else {
      setWorkUser([]);
    }
    setTaskPoint(task.points.toString());
    setTaskType(taskType);
    setEditTaskIndex(task.workIdx);
    setIsModalOpen(true);
  };

  const renderTaskList = (tasks, taskType) => {
    const formatDateTime = (dateTime) => {
      if (!dateTime) return "";
      const date = new Date(dateTime);
      return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    };

    return tasks.map((task, index) => (
      <li key={task.workIdx} className={styles.taskItem}>
        <div className={styles.taskContent}>
          <span className={styles.taskTitle}>{task.workTitle}</span>
          <br />
          <span className={styles.taskContent}>{task.workContent}</span>
          <br />
          {taskType === "daily" ? (
            <span className={styles.taskUser}>
              담당자:{" "}
              {task.participantNames && task.participantNames.length > 0
                ? task.participantNames.join(", ")
                : "없음"}
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
                <button onClick={() => handleMissionComplete(task)}>미션 성공</button>
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
    <div className="main">
      <div className={styles.board}>
        <div className={styles.column}>
          <div className={styles.column_header}>
            <h3>매일 할 일</h3>
            <span className={tasks.daily.length > 0 ? styles.circleDaily : ""}>
              {tasks.daily.length}
            </span>
            <div className={styles.add_task} onClick={openDailyModal}>
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
              }
            >
              {tasks.shortTerm.length}
            </span>
            <div className={styles.add_task} onClick={openShortTermModal}>
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

      {/* 미션 성공 모달 */}
      <CompleteModal
        isOpen={isCompleteModalOpen}
        onRequestClose={() => setIsCompleteModalOpen(false)}
        taskName={selectedTask?.workTitle || ""}
        selectedFiles={selectedFiles} // 파일 리스트 전달
        setSelectedFiles={setSelectedFiles} // 파일 설정 함수 전달
        onComplete={() => setIsCompleteModalOpen(false)} // 모달 닫기만 처리
      />
    </div>
  );
};

export default Housework2;
