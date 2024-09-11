import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./Feed.module.css";
import AddFeed from "./AddFeed";
import FeedList from "./FeedList";
import Preloader from "../preloader/Preloader";
import { ToastContainer, toast } from "react-toastify";
import { toastSuccess } from "../Toast/showCustomToast";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(2); // 페이지당 항목 수
  const [isFirstPageLoaded, setIsFirstPageLoaded] = useState(false);

  const userData = useSelector((state) => state.user.userData);
  const loaderRef = useRef(null);

  const getAllFeeds = useCallback(
    async (page) => {
      try {
        setIsLoading(true);
        console.log("현재 요청 페이지 : ", page);
        const response = await axios.get(
          `http://localhost:8089/wefam/get-all-feeds/${
            userData.familyIdx
          }?page=${page - 1}&size=${itemsPerPage}`
        );
        if (response.data) {
          console.log("feeds : ", response.data.content);
          console.log("총 페이지 수: ", response.data.totalPages);
          setFeeds((prevFeeds) =>
            page === 1
              ? response.data.content
              : [...prevFeeds, ...response.data.content]
          );
          setTotalPages(response.data.totalPages || 1);
          if (page === 1) {
            setIsFirstPageLoaded(true); // 첫 페이지가 로드되었음을 표시
            console.log("첫번째 페이지 로드!");
          } else if (page === 2) {
            console.log("두번째 페이지 로드");
          }
        }
      } catch (error) {
        console.error(
          `${userData.familyIdx}번 가족 getAllFeeds 함수 에러 : ${error}`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [userData.familyIdx, itemsPerPage]
  );

  const fetchWriter = useCallback(async (feedIdx) => {
    try {
      const response = await axios.get(
        `http://localhost:8089/wefam/get-feed-detail/${feedIdx}`
      );
      console.log("피드 작성자 아이디 확인 : ", response.data.userId);
      return response.data.userId;
    } catch (error) {
      console.error("피드 작성자 아이디 요청 에러:", error);
    }
  }, []);

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

  const updateFeed = useCallback(
    async (feedIdx, feedContent) => {
      console.log(`updateFeed 함수 실행 : ${feedIdx}번 피드 수정 요청`);
      try {
        setIsLoading(true);
        const writerId = await fetchWriter(feedIdx);

        if (userData.id === writerId) {
          await axios.patch(
            `http://localhost:8089/wefam/update-feed/${feedIdx}`,
            { feedContent }
          );
          await getAllFeeds(1);
          toastSuccess("피드가 성공적으로 업데이트되었습니다!");
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
    [userData.id, currentPage, fetchWriter, getAllFeeds]
  );

  useEffect(() => {
    getAllFeeds(currentPage);
  }, [getAllFeeds, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          currentPage < totalPages
        ) {
          setIsLoading(true); // 로딩 상태를 true로 설정
          setTimeout(() => {
            setCurrentPage((prevPage) => prevPage + 1); // 1초 후에 페이지 변경
          }, 1000); // 1초 지연
        } else if (currentPage === totalPages) {
          setIsLoading(false);
          observer.disconnect(); // 마지막 페이지일 때 옵저버 해제
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading, currentPage, totalPages]);

  // 이거는 이전과 다음 버튼 이용한 경우... 페이징 처리
  // const handlePageChange = (newPage) => {
  //   if (newPage > 0 && newPage <= totalPages) {
  //     setIsLoading(true); // 지연 로딩 동안 로딩 상태 true로 설정
  //     setTimeout(() => {
  //       setCurrentPage(newPage); // 1초 후에 페이지를 변경
  //       setIsLoading(false); // 페이지가 변경된 후 로딩 상태 false로 설정
  //     }, 3000); // 1초 지연
  //   }
  // };

  return (
    <div className="main">
      <div className={styles.feed}>
        {isLoading && currentPage === 1 ? (
          <Preloader isLoading={isLoading} />
        ) : (
          <div className={styles.feedContent}>
            <AddFeed
              onGetAllFeeds={getAllFeeds}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            <FeedList
              feeds={feeds}
              getAllFeeds={getAllFeeds}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onGetFeedDetail={getFeedDetail}
              onUpdateFeed={updateFeed}
            />
            <div ref={loaderRef} className={styles.loader}></div>
            {/* <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>
              <span>
                페이지 {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div> */}
            {isLoading && currentPage >= 3 ? (
              <div className={styles.spinnerContainer}>
                <div className={styles.spinner}></div>
              </div>
            ) : null}
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Feed;
