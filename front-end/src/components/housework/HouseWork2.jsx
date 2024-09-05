import React, { useState, useEffect } from "react";
import styles from "./HouseWork2.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import WorkModal from "./WorkModal";
import CompleteModal from "./CompleteModal";
import { BsThreeDots, BsPlusCircle } from "react-icons/bs";
import { FcRating } from "react-icons/fc";
import Modal from "react-modal";

Modal.setAppElement("#root");

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
  const [warningMessages, setWarningMessages] = useState({
    workUser: "",
    taskPoint: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(null); // 드롭다운 토글 상태
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false); // 완료 모달 상태 추가
  const [selectedTask, setSelectedTask] = useState(null); // 완료하려는 작업 선택
  const [selectedFiles, setSelectedFiles] = useState([]); // 이미지 파일을 저장할 상태
  const [selectedTaskImages, setSelectedTaskImages] = useState();
  const [isImageModalOpen, setIsImageModalOpen] = useState();

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
      // userId를 query로 넘겨줌
      const response = await axios.get(`http://localhost:8089/wefam/get-works?userId=${userData.id}`);

      const { works, totalPoints } = response.data;  // 총 포인트와 작업 데이터를 분리

      setTasks({
        daily: works.filter((task) => task.taskType === "daily"),
        shortTerm: works.filter((task) => task.taskType === "shortTerm"),
      });
      console.log("총 포인트:", totalPoints);  // 콘솔에 총 포인트 출력
      console.log("작업 데이터:", works);  // 작업 데이터에 completed 필드가 있는지 확인
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

  const handleOutsideClick = (e) => {
    if (!e.target.closest(`.${styles.dropdownContainer}`)) {
      setDropdownOpen(null);
    }
  };

  // 미션 완료 모달 열기
  const handleMissionComplete = (task) => {
    // 매일 할 일일 경우에만 담당자 여부를 확인
    if (task.taskType === "daily" && !task.participantNames.includes(userData.name)) {
      // 현재 사용자가 담당자가 아닐 경우
      alert("작업을 완료할 권한이 없습니다. 담당자가 아닙니다.");
      return; // 함수 종료
    }

    // 오늘의 미션 (shortTerm)은 담당자 여부 확인 없이 미션 성공 가능
    setSelectedTask(task);
    setIsCompleteModalOpen(true); // 완료 모달 열기
  };

  // 이미지 모달을 열고 이미지를 설정하는 함수
  const openImageModal = (images) => {
    setSelectedTaskImages(images);
    setIsImageModalOpen(true);
  };

  // 이미지 모달을 닫는 함수
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedTaskImages([]);
  };

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
              {/* 작업 완료 여부에 따라 아이콘을 변경 */}
              {task.completed ? (
                <FcRating
                  className={styles.taskIcon}
                  onClick={() => openImageModal(task.images)} // 이미지를 모달로 열기
                />
              ) : (
                <BsThreeDots
                  className={styles.taskIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(`${taskType}-${index}`);
                  }}
                />
              )}
              <span className={styles.taskPoints}>{task.points} 포인트</span>
            </div>
            {dropdownOpen === `${taskType}-${index}` && (
              <div className={styles.dropdownMenu}>
                <button onClick={() => handleMissionComplete(task)}>
                  미션 성공
                </button>
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
    <div className="main" onClick={handleOutsideClick}>
      <div styles={styles.gridContainer}>
        <div className={styles.board}>
          <div className={styles.column}>
            <div className={styles.column_header}>
              <h3>매일 할 일</h3>
              <span
                className={
                  tasks.daily.length > 0
                    ? styles.circleDaily
                    : styles.circleZero
                }
              >
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
                  tasks.shortTerm.length > 0
                    ? styles.circleShortTerm
                    : styles.circleZero
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
      </div>
      {/*오른쪽 그리드 */}
      <div styles={styles.board}>
        <div className={styles.column}>
          <div className={styles.column_header}>
            <h3>매일 할 일</h3>
            <span
              className={
                tasks.daily.length > 0 ? styles.circleDaily : styles.circleZero
              }
            >
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
        selectedTask={selectedTask} // 선택된 작업 전달
        selectedFiles={selectedFiles} // 파일 리스트 전달
        setSelectedFiles={setSelectedFiles} // 파일 설정 함수 전달
        onComplete={() => {
          setIsCompleteModalOpen(false);
          fetchTasks(); // 완료 후 목록 새로고침
        }}
      />

      {/* 이미지 모달 */}
      <Modal
        isOpen={isImageModalOpen}
        onRequestClose={closeImageModal}
        contentLabel="작업 이미지"
        className={styles.imageModalContent}
        overlayClassName={styles.imageModalOverlay}
      >
        <div className={styles.modalBody}>
          <h2>작업 이미지</h2>
          <div className={styles.imagePreviewContainer}>
            {selectedTaskImages && selectedTaskImages.length > 0 ? (
              selectedTaskImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`작업 이미지 ${index}`}
                  className={styles.modalImage}
                />
              ))
            ) : (
              <p>이미지가 없습니다.</p>
            )}
          </div>
          {/* <button onClick={closeImageModal} className={styles.closeButton}>
            닫기
          </button> */}
        </div>
      </Modal>

    </div>
  );
};

export default Housework2;