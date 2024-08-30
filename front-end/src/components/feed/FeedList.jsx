import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./FeedList.module.css";
import FeedItem from "./FeedItem";

const FeedList = React.memo(
  ({ feeds, onGetFeedDetail, onUpdateFeed, onDeleteFeed }) => {
    console.log("FeedList 리렌더링됨");
    return (
      <div className={styles.feedList}>
        {feeds.map((feed) => (
          // FeedItem 컴포넌트를 사용하여 각 피드를 렌더링
          <FeedItem
            key={feed.feedIdx}
            feed={feed}
            onGetFeedDetail={onGetFeedDetail}
            onUpdateFeed={onUpdateFeed}
            onDeleteFeed={onDeleteFeed}
          />
        ))}
      </div>
    );
  }
);

export default FeedList;