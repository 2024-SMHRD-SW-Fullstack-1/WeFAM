import React, { useState } from "react";
import styles from "./AddFeed.module.css";
import { BsArrowReturnLeft } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { BsArchive } from "react-icons/bs";
import { PiGameControllerLight } from "react-icons/pi";
import axios from "axios";

const AddFeed = () => {
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");

  async function addFeed() {
    try {
      const response = await axios.post(
        "http://localhost:8089/wefam/add-feed",
        {
          familyIdx: 1,
          id: "jgod",
          feedContent: content,
          feedLocation: "여수",
        }
      );
      console.log("addFeed 함수 실행 : " + response.data);
    } catch (error) {
      console.error("addFeed 함수 에러 : ", error);
    }
  }

  return (
    <div className={styles.addFeed}>
      <textarea
        className={styles.content}
        placeholder="무슨 생각을 하고 계신가요?"
        name="content"
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <hr className={styles.customHr}></hr>
      <div className={styles.footer}>
        <span>
          <button>
            <CiImageOn />
          </button>
          <button>
            <CiCalendar />
          </button>
          <button>
            <PiGameControllerLight />
          </button>
          <button>
            <BsArchive />
          </button>
        </span>
        <span>
          <button onClick={addFeed}>
            <BsArrowReturnLeft />
          </button>
        </span>
      </div>
    </div>
  );
};

export default AddFeed;
