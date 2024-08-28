import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "./Feed.module.css";
import AddFeed from "./AddFeed";
import FeedList from "./FeedList";
const Feed = () => {
  const [feeds, setFeeds] = useState([]);

  // 모든 피드를 가져오는 함수
  const getAllFeeds = async () => {
    try {
      // API 호출하여 피드 데이터 가져오기
      const response = await axios.get(
        "http://localhost:8089/wefam/get-all-feeds"
      );
      console.error("getAllFeeds 함수 실행 : ", response.data);
      // 가져온 피드 데이터를 상태에 저장
      setFeeds(response.data);
    } catch (error) {
      // 에러 발생 시 콘솔에 에러 메시지 출력
      console.error("getAllFeeds 함수 에러 : ", error);
    }
  };

  // 새로운 피드 작성 함수
  const addFeed = async (newFeed) => {
    try {
      const response = await axios.post(
        "http://localhost:8089/wefam/add-feed",
        newFeed
      );
      console.log("addFeed 함수 실행 : ", response.data);
      getAllFeeds();
    } catch (error) {
      console.error("addFeed 함수 에러 : ", error);
    }
  };

  useEffect(() => {
    getAllFeeds(); // 컴포넌트가 마운트될 때 피드를 가져옴
  }, []);

  return (
    <div className="main">
      <div className={styles.feed}>
        <AddFeed onAddFeed={addFeed} />
        <FeedList feeds={feeds} />
      </div>
    </div>
  );
};

export default Feed;
