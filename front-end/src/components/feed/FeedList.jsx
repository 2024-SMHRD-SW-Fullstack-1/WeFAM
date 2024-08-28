import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./FeedList.module.css";
import FeedItem from "./FeedItem";

const FeedList = ({ feeds }) => {
  // 피드를 삭제하는 함수
  const deleteFeed = async (feedIdx) => {
    // 삭제 확인을 위한 창 띄우기
    if (window.confirm(`${feedIdx}번 피드를 삭제하시겠습니까?`)) {
      try {
        // API 호출하여 피드 삭제
        await axios.delete(
          `http://localhost:8089/wefam/delete-feed/${feedIdx}`
        );
        // 삭제 후 다시 피드 데이터를 가져와서 상태 업데이트
        const response = await axios.get(
          "http://localhost:8089/wefam/get-all-feeds"
        );
        // setFeeds(response.data);
      } catch (error) {
        // 에러 발생 시 콘솔에 에러 메시지 출력
        console.error("Delete Feed 에러 : ", error);
      }
    }
  };

  return (
    <div className={styles.feedList}>
      {feeds.map((feed) => (
        // FeedItem 컴포넌트를 사용하여 각 피드를 렌더링
        <FeedItem
          key={feed.feedIdx}
          feed={feed}
          // onUpdate={updateFeed}
          // onDelete={deleteFeed}
        />
      ))}
    </div>
  );
};

export default FeedList;
