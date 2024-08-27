import React from "react";
import styles from "./Feed.module.css";
import AddFeed from "./AddFeed";
import FeedDetail from "./FeedDetail";

const Feed = () => {
  return (
    <div className='main'>
      <div className={styles.feed}>
        <AddFeed />
        <FeedDetail />
      </div>
    </div>
  );
};

export default Feed;
