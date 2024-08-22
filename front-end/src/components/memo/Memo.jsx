import React from "react";

import styles from "./Memo.module.css";

import { CiTrash } from "react-icons/ci";
import { IoIosAddCircleOutline } from "react-icons/io";

const Memo = () => {
  return (
    <div className={styles.memo}>
      <div className={styles.subHeader}>
        <h1>그룹명 메모장</h1>
        <CiTrash />
        <IoIosAddCircleOutline />
      </div>
    </div>
  );
};

export default Memo;
