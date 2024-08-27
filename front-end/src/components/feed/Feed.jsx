import React from "react";
import styles from "./Feed.module.css";
import AddFeed from "./AddFeed";
import FeedList from "./FeedList";
const Feed = () => {
  return (
    <div className="main">
      <div className={styles.feed}>
        <AddFeed />
        <FeedList />
      </div>
    </div>
  );
};

export default Feed;
