import React, { useState, useEffect } from "react";
import styles from "./HouseWork2.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import WorkModal from "./WorkModal";
import CompleteModal from "./CompleteModal";
import { BsThreeDotsVertical, BsPlusCircle } from "react-icons/bs";
import { FcRating } from "react-icons/fc";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Housework2 = () => {
  const userData = useSelector((state) => state.user.userData);

  const [localFamilyMembers, setFamilyMembers] = useState([]);
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
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedTaskImages, setSelectedTaskImages] = useState();
  const [isImageModalOpen, setIsImageModalOpen] = useState();
  const [completedTasks, setCompletedTasks] = useState([]);

  // 모달을 여는 함수
  const openDailyModal = () => {
    setTaskType("daily");
    openModal();
  };

  const openShortTermModal = () => {
    setTaskType("shortTerm");
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

  // 작업 목록을 가져오는 함수
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8089/wefam/get-works?userId=${userData.id}`
      );

      const { works } = response.data;

      setTasks({
        daily: works.filter((task) => task.taskType === "daily"),
        shortTerm: works.filter((task) => task.taskType === "shortTerm"),
      });
    } catch (error) {
      console.error("작업 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // 처음 렌더링 시 작업 목록 및 가족 구성원 정보 가져오기
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

  // 완료된 작업을 가져오는 함수
  const fetchCompletedTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8089/wefam/completed-works"
      );

      const completedTasksWithImages = response.data.map((item) => {
        return {
          ...item.workLog,
          images: item.images,
          userProfileImg: item.userProfileImg,
          userName: item.userName,
        };
      });

      setCompletedTasks(completedTasksWithImages);
    } catch (error) {
      console.error("완료된 작업을 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  // 새로운 작업 추가 또는 수정하는 함수
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

  // 상태에서 작업을 업데이트하는 함수
  const updateTaskInState = (updatedTask, taskType) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [taskType]: prevTasks[taskType].map((task) =>
        task.workIdx === updatedTask.workIdx ? updatedTask : task
      ),
    }));
  };

  // 새로운 작업을 상태에 추가하는 함수
  const addTaskToState = (newTask, taskType) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [taskType]: [...prevTasks[taskType], newTask],
    }));
  };

  // 선택한 작업 삭제하는 함수
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

  const openImageModal = (images) => {
    setSelectedTaskImages(images);
    setIsImageModalOpen(true);
  };

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleMissionComplete = (task) => {
    if (task.taskType !== "shortTerm") {
      if (!task.participantNames.includes(userData.name)) {
        alert("작업을 완료할 권한이 없습니다. 담당자가 아닙니다.");
        return;
      }
    }

    setSelectedTask(task);
    setIsCompleteModalOpen(true);
  };

  const handleTaskEdit = (taskIndex, taskList, taskType) => {
    // taskList에서 해당 task를 찾음
    const task = taskList[taskIndex];

    // task가 존재하는지 확인
    if (!task) {
      console.error(`Task at index ${taskIndex} not found in taskList`);
      return; // task가 없으면 함수 실행 중단
    }

    // task의 값을 상태로 설정
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

  const handleOutsideClick = (e) => {
    if (!e.target.closest(`.${styles.dropdownContainer}`)) {
      setDropdownOpen(null);
    }
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedTaskImages([]);
  };

  // 작업 참가자(유저)를 렌더링하는 함수
  const renderTaskUsers = (task) => {
    return task.participantsWithProfile?.map((user) => (
      <div key={user.id} className={styles.userProfile}>
        <img
          src={user.profileImg ? user.profileImg : "default_profile_image_url"}
          alt={user.name}
          className={styles.userImage}
        />
        <span className={styles.userName}>{user.name}</span>
      </div>
    ));
  };

  // 완료된 작업의 유저 정보를 렌더링하는 함수
  const renderCompletedTaskUsers = (task) => {
    return (
      <div className={styles.userProfile}>
        <img
          src={
            task.userProfileImg
              ? task.userProfileImg
              : "default_profile_image_url"
          }
          alt={task.userName ? task.userName : "Unknown"}
          className={styles.userImage}
        />
        <span className={styles.userName}>
          {task.userName ? task.userName : "Unknown"}
        </span>
      </div>
    );
  };

  // 완료된 작업 리스트 렌더링 함수
  const renderCompletedTaskList = (tasks) => {
    return tasks.map((task, index) => (
      <li key={task.workIdx} className={styles.taskItem}>
        <div className={styles.taskContent}>
          <span className={styles.taskTitle}>{task.workTitle}</span>
          <br />
          <span className={styles.taskContent}>{task.workContent}</span>
          <br />
          {renderCompletedTaskUsers(task)}
        </div>
        <div className={styles.dropdownContainer}>
          <div className={styles.taskRight}>
            <div>
              <FcRating
                className={styles.taskIcon}
                onClick={() => openImageModal(task.images)}
              />
              <span className={styles.taskPoints}>{task.points} 포인트</span>
            </div>
          </div>
        </div>
      </li>
    ));
  };

  // 작업 항목 렌더링 함수
  const TaskItem = ({ task, index, taskType }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isCompleted = task.completed;
    const toggleReadMore = () => setIsExpanded(!isExpanded);

    const maxContentLength = 34;
    const isLongContent = task.workContent.length > maxContentLength;
    const displayedContent =
      isExpanded || !isLongContent
        ? task.workContent
        : task.workContent.slice(0, maxContentLength) + "...";

    return (
      <li
        key={task.workIdx}
        className={`${styles.taskItem} ${
          isCompleted ? styles.completedTask : ""
        }`}
      >
        <div className={styles.taskContent}>
          <span className={styles.taskTitle}>{task.workTitle}</span>
          <br />
          <span className={styles.taskDescription}>
            {displayedContent}
            {isLongContent && (
              <button
                onClick={toggleReadMore}
                className={styles.readMoreButton}
              >
                {isExpanded ? "간략히" : "더보기"}
              </button>
            )}
          </span>
          <div className={styles.userContainer}>{renderTaskUsers(task)}</div>
        </div>

        <div className={styles.taskRight}>
          <span className={styles.taskPoints}>{task.points} 포인트</span>

          {/* 완료된 작업일 경우 드롭다운 아이콘을 클릭할 수 없게 설정 */}
          {!isCompleted && (
            <BsThreeDotsVertical
              className={styles.taskIcon}
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(`${taskType}-${index}`);
              }}
            />
          )}
        </div>

        {/* 드롭다운 메뉴 */}
        {dropdownOpen === `${taskType}-${index}` && (
          <div
            className={styles.dropdownMenu}
            onClick={(e) => {
              e.stopPropagation(); // 클릭 이벤트 버블링 방지
              setDropdownOpen(null); // 드롭다운 메뉴를 클릭하면 닫음
            }}
          >
            <button
              onClick={() => {
                handleMissionComplete(task);
                setDropdownOpen(null); // 클릭 시 드롭다운 닫기
              }}
            >
              미션 성공
            </button>
            <button
              onClick={() => {
                handleTaskEdit(index, tasks[taskType], taskType);
                setDropdownOpen(null); // 클릭 시 드롭다운 닫기
              }}
            >
              수정
            </button>
            <button
              onClick={() => {
                deleteSelectedTasks(index, taskType);
                setDropdownOpen(null); // 클릭 시 드롭다운 닫기
              }}
            >
              삭제
            </button>
          </div>
        )}
      </li>
    );
  };

  // 작업 목록을 렌더링하는 함수
  const renderTaskList = (tasks, taskType) => {
    return tasks.map((task, index) => (
      <TaskItem
        key={task.workIdx}
        task={task}
        index={index}
        taskType={taskType}
      />
    ));
  };

  return (
    <div className="main" onClick={handleOutsideClick}>
      <div className={styles.board}>
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

        <div className={styles.column}>
          <div className={styles.column_header}>
            <h3>완료된 할 일</h3>
            <span
              className={
                completedTasks.length > 0
                  ? styles.circleFinished
                  : styles.circleZero
              }
            >
              {completedTasks.length}
            </span>
          </div>
          <ul className={styles.taskList}>
            {renderCompletedTaskList(completedTasks)}
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

      <CompleteModal
        isOpen={isCompleteModalOpen}
        onRequestClose={() => setIsCompleteModalOpen(false)}
        taskName={selectedTask?.workTitle || ""}
        selectedTask={selectedTask}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        onComplete={() => {
          setIsCompleteModalOpen(false);
          fetchTasks();
          fetchCompletedTasks();
        }}
      />

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
        </div>
      </Modal>
    </div>
  );
};

export default Housework2;
