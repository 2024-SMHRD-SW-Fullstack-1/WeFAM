import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "./Feed.module.css";
import AddFeed from "./AddFeed";
import FeedList from "./FeedList";
import Preloader from "../preloader/Preloader";
const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 모든 피드를 가져오는 함수
  const getAllFeeds = useCallback(async () => {
  const [familyIdx, setFamilyIdx] = useState(0);

  // Redux store에서 현재 로그인한 사용자의 데이터를 가져오기.
  // 이 데이터는 state.user.userData에 저장되어 있음.
  const userData = useSelector((state) => state.user.userData);

  // 확인을 위해 콘솔에 출력
  console.log(userData);
  // 로그인한 사용자의 데이터 확인
  console.log("userData : ", userData);

  // Redux store에서 현재 로그인한 사용자의 가족 데이터를 가져오기.
  // 이 데이터는 state.family.familyData에 저장되어 있음.
  // const familyData = useSelector((state) => state.family.familyData);
  // 로그인한 사용자의 가족 데이터 확인
  // console.log("familyData는 ", familyData);

  // 내가 속한 가족 데이터 받기.
  const getJoiningData = useCallback(async (userId) => {
    console.log("가족 데이터 받아오기");
    try {
      const response = await axios.get(
        `http://localhost:8089/wefam/get-joiningData/${userId}`
      );
      console.log("나의 가족 정보 : ", response.data);
      return response.data;
      // dispatch(setFamilyData(familyData)); // Redux에 가족 데이터 저장
      // nav("/", { state: { familyData } });
    } catch (error) {
      console.error("가족 정보 요청 에러", error);
    }
  }, []);

  // 내가 속한 가족의 모든 피드를 가져오는 함수
  const getAllFeeds = useCallback(async (familyIdx) => {
    try {
      setIsLoading(true);
      // API 호출하여 피드 데이터 가져오기
      const response = await axios.get(
        "http://localhost:8089/wefam/get-all-feeds"
      );
      setFeeds(response.data);
      console.log("getAllFeeds 함수 실행 : ", response.data);
    } catch (error) {
      // 에러 발생 시 콘솔에 에러 메시지 출력
      console.error("getAllFeeds 함수 에러 : ", error);
    } finally {
      setIsLoading(false);
    }
  });

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
  });

  // 피드를 수정할 때 피드 내용을 띄워줄 함수
  const getFeedDetail = useCallback(async (feedIdx) => {
    try {
      setIsLoading(true);
      // API 호출하여 피드 데이터 가져오기
      const response = await axios.get(
        `http://localhost:8089/wefam/get-feed-detail/${feedIdx}`
      );
      console.log("getFeedDetail 함수 실행 : ", response.data);
      return response; // 올바른 구조로 반환해야 함
    } catch (error) {
      // 에러 발생 시 콘솔에 에러 메시지 출력
      console.error("getFeedDetail 함수 에러 : ", error);
    } finally {
      setIsLoading(false);
    }
  });

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
  });

  // 피드를 삭제하는 함수
  const deleteFeed = useCallback(async (feedIdx) => {
    try {
      console.log("deleteFeed 함수 실행");
      setIsLoading(true);
      // API 호출하여 피드 삭제
      await axios.delete(`http://localhost:8089/wefam/delete-feed/${feedIdx}`);
      // 삭제 후 다시 피드 데이터를 가져오기 (리렌더링 필요)
      await getAllFeeds();
    } catch (error) {
      // 에러 발생 시 콘솔에 에러 메시지 출력
      console.error("deleteFeed 함수 에러 : ", error);
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    getAllFeeds(); // 컴포넌트가 마운트될 때 피드를 가져옴
  }, []);

  return (
    <div className="main">
      <div className={styles.feed}>
        {/* Preloader태그 쪽에 Feed를 같이 넣으면 같이 리렌더링되는 불상사... */}
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
        {/* 로딩 상태일 때만 로딩 컴포넌트 표시 */}
      </div>
    </div>
  );
};

export default Feed;