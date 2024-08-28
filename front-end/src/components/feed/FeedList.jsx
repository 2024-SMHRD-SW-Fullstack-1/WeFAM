import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./FeedList.module.css";
import FeedItem from "./FeedItem";

const FeedList = () => {
  // 현재 피드 화면에서 보여질 피드들
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    // 모든 피드를 가져오는 비동기 함수
    const getAllFeeds = async () => {
      try {
        // API 호출하여 피드 데이터 가져오기
        const response = await axios.get(
          "http://localhost:8089/wefam/get-all-feeds"
        );
        // 가져온 피드 데이터를 상태에 저장
        setFeeds(response.data);
      } catch (error) {
        // 에러 발생 시 콘솔에 에러 메시지 출력
        console.error("get all feeds 에러 : ", error);
      }
    };

    // 컴포넌트가 마운트될 때 피드 데이터 가져오기
    getAllFeeds();
  }, []); // 빈 배열을 의존성으로 설정하여 컴포넌트가 처음 마운트될 때만 실행됨

  // 피드를 수정하는 함수
  const updateFeed = async (feedIdx) => {};
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
        setFeeds(response.data);
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
        <FeedItem key={feed.feedIdx} feed={feed} onDelete={deleteFeed} />
      ))}
    </div>
  );
};

export default FeedList;
