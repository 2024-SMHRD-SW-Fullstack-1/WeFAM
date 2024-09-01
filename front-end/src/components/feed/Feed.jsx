import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "./Feed.module.css";
import AddFeed from "./AddFeed";
import FeedList from "./FeedList";
import Preloader from "../preloader/Preloader";
import { useSelector } from "react-redux";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [familyIdx, setFamilyIdx] = useState(0);

  // Redux store에서 현재 로그인한 사용자의 데이터를 가져오기.
  const userData = useSelector((state) => state.user.userData);

  // 확인을 위해 콘솔에 출력
  console.log(userData);

  // 내가 속한 가족 데이터 받기.
  const getJoiningData = useCallback(async (userId) => {
    console.log("가족 데이터 받아오기");
    try {
      const response = await axios.get(
        `http://localhost:8089/wefam/get-joiningData/${userId}`
      );
      console.log("나의 가족 정보 : ", response.data);
      return response.data;
    } catch (error) {
      console.error("가족 정보 요청 에러", error);
    }
  }, []);

  // 내가 속한 가족의 모든 피드를 가져오는 함수
  const getAllFeeds = useCallback(async (familyIdx) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:8089/wefam/get-all-feeds"
      );
      setFeeds(response.data);
      console.log("getAllFeeds 함수 실행 : ", response.data);
    } catch (error) {
      console.error("getAllFeeds 함수 에러 : ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 새로운 피드 작성 함수
  const addFeed = useCallback(async (newFeed) => {
    try {
      console.log("addFeed 함수 실행 ");
      setIsLoading(true);
      await axios.post("http://localhost:8089/wefam/add-feed", newFeed);
      await getAllFeeds();
    } catch (error) {
      console.error("addFeed 함수 에러 : ", error);
    } finally {
      setIsLoading(false);
    }
  }, [getAllFeeds]);

  // 피드를 수정할 때 피드 내용을 띄워줄 함수
  const getFeedDetail = useCallback(async (feedIdx) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8089/wefam/get-feed-detail/${feedIdx}`
      );
      console.log("getFeedDetail 함수 실행 : ", response.data);
      return response;
    } catch (error) {
      console.error("getFeedDetail 함수 에러 : ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 피드를 수정하는 함수
  const updateFeed = useCallback(async (feedIdx, feedContent) => {
    console.log(`updateFeed 함수 실행 : ${feedIdx}번 피드 업데이트`);
    try {
      setIsLoading(true);
      await axios.patch(`http://localhost:8089/wefam/update-feed/${feedIdx}`, {
        feedContent,
      });
      await getAllFeeds();
      console.log("피드의 내용만 업데이트");
    } catch (error) {
      console.error("피드 업데이트 에러", error);
    } finally {
      setIsLoading(false);
    }
  }, [getAllFeeds]);

  // 피드를 삭제하는 함수
  const deleteFeed = useCallback(async (feedIdx) => {
    try {
      console.log("deleteFeed 함수 실행");
      setIsLoading(true);
      await axios.delete(`http://localhost:8089/wefam/delete-feed/${feedIdx}`);
      await getAllFeeds();
    } catch (error) {
      console.error("deleteFeed 함수 에러 : ", error);
    } finally {
      setIsLoading(false);
    }
  }, [getAllFeeds]);

  useEffect(() => {
    getAllFeeds(); // 컴포넌트가 마운트될 때 피드를 가져옴
  }, [getAllFeeds]);

  return (
    <div className="main">
      <div className={styles.feed}>
        {isLoading ? (
          <Preloader isLoading={isLoading} />
        ) : (
          <div className={styles.feedContent}>
            <AddFeed onAddFeed={addFeed} />
            <FeedList
              feeds={feeds}
              onGetFeedDetail={getFeedDetail}
              onUpdateFeed={updateFeed}
              onDeleteFeed={deleteFeed}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
