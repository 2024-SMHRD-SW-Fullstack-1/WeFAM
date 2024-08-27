import React from "react";
import styles from "./AddFeed.module.css";
import { BsArrowReturnLeft } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { BsArchive } from "react-icons/bs";
import { PiGameControllerLight } from "react-icons/pi";

const AddFeed = () => {
  return (
    <div className={styles.writeFeed}>
      <textarea
        className={styles.content}
        placeholder="무슨 생각을 하고 계신가요?"
        name="content"
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
          <button>
            <BsArrowReturnLeft />
          </button>
        </span>
      </div>
    </div>
  );
};

export default AddFeed;
