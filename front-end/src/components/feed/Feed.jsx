import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./Feed.module.css";
import AddFeed from "./AddFeed";
import FeedList from "./FeedList";
import Preloader from "../preloader/Preloader";

const Feed = () => {
  // 현재 getAllFeeds로 가족 피드들을 모두 불러와서 피드 데이터가 feed에 들어옴
  // feed 변수로 FeedItem에 뿌려서 출력 중

  const [feeds, setFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Redux store에서 현재 로그인한 사용자의 데이터를 가져오기.
  const userData = useSelector((state) => state.user.userData);

  // 내가 속한 가족의 모든 피드를 가져오는 함수
  const getAllFeeds = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8089/wefam/get-all-feeds/${userData.familyIdx}`
      );
      setFeeds(response.data);
      console.log(
        `${userData.familyIdx}번 가족 getAllFeeds 함수 실행 : ${response.data}`
      );
    } catch (error) {
      // 에러 발생 시 콘솔에 에러 메시지 출력
      console.error(
        `${userData.familyIdx}번 가족 getAllFeeds 함수 에러 : ${error}`
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 새로운 피드 작성 함수
  const addFeed = useCallback(
    async (newFeed) => {
      try {
        console.log("addFeed 함수 실행 ");
        setIsLoading(true);
        await axios.post("http://localhost:8089/wefam/add-feed", newFeed, {
          headers: {
            "Content-Type": "application/json", // 서버가 JSON 형식을 기대할 경우
          },
        });
        await getAllFeeds(userData.familyIdx);
      } catch (error) {
        console.error("addFeed 함수 에러 : ", error);
      } finally {
        setIsLoading(false);
      }
    },
    [userData.familyIdx, getAllFeeds]
  );

  // 피드 디테일 정보 가져오는 함수
  const fetchWriter = useCallback(async (feedIdx) => {
    try {
      // GET 요청을 보내어 feed 데이터를 가져오기
      const response = await axios.get(
        `http://localhost:8089/wefam/get-feed-detail/${feedIdx}`
      );

      console.log("피드 작성자 아이디 확인 : ", response.data.userId);

      // 피드 작성자 ID를 반환
      return response.data.userId;
    } catch (error) {
      console.error("피드 작성자 아이디 요청 에러:", error);
    }
  }, []);

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
  const updateFeed = useCallback(
    async (feedIdx, feedContent) => {
      console.log(`updateFeed 함수 실행 : ${feedIdx}번 피드 수정 요청`);
      try {
        setIsLoading(true);
        const writerId = await fetchWriter(feedIdx); // 작성자 ID 가져오기

        if (userData.id === writerId) {
          await axios.patch(
            `http://localhost:8089/wefam/update-feed/${feedIdx}`,
            {
              feedContent,
            }
          );
          await getAllFeeds(userData.familyIdx);
          console.log("피드의 내용만 업데이트");
        } else {
          alert("피드 수정 중에 오류가 발생하였습니다. 수정 권한이 없습니다.");
        }
      } catch (error) {
        console.error("피드 업데이트 에러", error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchWriter, userData.id, userData.familyIdx, getAllFeeds]
  );

  // 피드를 삭제하는 함수
  const deleteFeed = useCallback(
    async (feedIdx) => {
      try {
        console.log(`deleteFeed 함수 실행 : ${feedIdx}번 피드 삭제 요청`);
        setIsLoading(true);
        const writerId = await fetchWriter(feedIdx); // 작성자 ID 가져오기
        console.log("userData.id : ", userData.id);
        console.log("writerId : ", writerId);
        if (userData.id === writerId) {
          // API 호출하여 피드 삭제
          await axios.delete(
            `http://localhost:8089/wefam/delete-feed/${feedIdx}`
          );
          // 삭제 후 다시 피드 데이터를 가져오기 (리렌더링 필요)
          await getAllFeeds(userData.familyIdx);
          console.log("피드 삭제 완료");
        } else {
          alert("피드 삭제 중에 오류가 발생하였습니다. 삭제 권한이 없습니다.");
        }
      } catch (error) {
        // 에러 발생 시 콘솔에 에러 메시지 출력
        console.error("deleteFeed 함수 에러 : ", error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchWriter, userData.id, userData.familyIdx, getAllFeeds]
  );

  useEffect(() => {
    getAllFeeds(userData.familyIdx);
  }, [getAllFeeds, userData.familyIdx]);

  return (
    <div className="main">
      <div className={styles.feed}>
        {isLoading ? (
          <Preloader isLoading={isLoading} />
        ) : (
          <div className={styles.feedContent}>
            <AddFeed onAddFeed={addFeed} onGetAllFeeds={getAllFeeds} />
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
