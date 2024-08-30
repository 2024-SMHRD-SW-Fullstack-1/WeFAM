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
        `http://localhost:8089/wefam/get-all-feeds/${familyIdx}`
      );
      setFeeds(response.data);
      console.log(
        `${familyIdx}번 가족 getAllFeeds 함수 실행 : ${response.data}`
      );
    } catch (error) {
      // 에러 발생 시 콘솔에 에러 메시지 출력
      console.error(`${familyIdx}번 가족 getAllFeeds 함수 에러 : ${error}`);
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
        await getAllFeeds(familyIdx);
      } catch (error) {
        console.error("addFeed 함수 에러 : ", error);
      } finally {
        setIsLoading(false);
      }
    },
    [familyIdx, getAllFeeds]
  );

  // 피드 작성자 ID 가져오기
  const fetchWriter = useCallback(async (feedIdx) => {
    try {
      // GET 요청을 보내어 feed 데이터를 가져오기.
      const response = await axios.get(
        `http://localhost:8089/wefam/get-feed-detail/${feedIdx}`
      );
      console.log("피드 작성자 아이디 데이터 : ", response.data.id);
      // 응답 받은 데이터를 상태로 설정.
      return response.data.id; // 작성자 ID를 반환
    } catch (error) {
      console.error("피드 작성자 아이디 요청 에러:", error);
    }
  }, []);

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
          await getAllFeeds(familyIdx);
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
    [fetchWriter, userData.id, familyIdx, getAllFeeds]
  );

  // 피드를 삭제하는 함수
  const deleteFeed = useCallback(
    async (feedIdx) => {
      try {
        console.log(`deleteFeed 함수 실행 : ${feedIdx}번 피드 삭제 요청`);
        setIsLoading(true);
        const writerId = await fetchWriter(feedIdx); // 작성자 ID 가져오기

        if (userData.id === writerId) {
          // API 호출하여 피드 삭제
          await axios.delete(
            `http://localhost:8089/wefam/delete-feed/${feedIdx}`
          );
          // 삭제 후 다시 피드 데이터를 가져오기 (리렌더링 필요)
          await getAllFeeds(familyIdx);
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
    [fetchWriter, userData.id, familyIdx, getAllFeeds]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 사용자 데이터에서 가족 데이터 가져오기
        const joiningData = await getJoiningData(userData.id);
        if (joiningData) {
          setFamilyIdx(joiningData.familyIdx);

          // 피드를 가져오기 전에 상태가 업데이트되기를 기다립니다.
          await getAllFeeds(joiningData.familyIdx);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userData.id, getJoiningData, getAllFeeds]);

  return (
    <div className="main">
      <div className={styles.feed}>
        {/* Preloader태그 쪽에 Feed를 같이 넣으면 같이 리렌더링되는 불상사... */}
        {isLoading ? (
          <Preloader isLoading={isLoading} />
        ) : (
          <div className={styles.feedContent}>
            <AddFeed onAddFeed={addFeed} onGetJoiningData={getJoiningData} />
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
