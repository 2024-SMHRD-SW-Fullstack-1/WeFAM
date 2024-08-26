import React from "react";
import styles from "./Feed.module.css";
import WriteFeed from "./WriteFeed";
import FeedDetail from "./FeedDetail";

const Feed = () => {
  return (
    <div className="main">
      <div className={styles.feed}>
        <WriteFeed />
        <FeedDetail />
      </div>
    </div>
  );
};

export default Feed;
