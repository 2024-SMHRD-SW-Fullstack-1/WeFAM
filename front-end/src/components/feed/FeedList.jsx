import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./FeedList.module.css";
import { elapsedTime } from "../../elapsedTime";

import profileDefaultImage from "../../assets/images/profile-default-image.png";
import { BsSuitHeart } from "react-icons/bs";
import { BsChatHeart } from "react-icons/bs";
import { BsThreeDots } from "react-icons/bs";

const FeedList = () => {
  const [feedSize, setFeedSize] = useState(0);
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8089/wefam/fetch-feeds"
        );
        setFeeds(response.data);
        console.log("총 피드의 개수 : ", response.data.length);
        console.log("가져온 피드들 : ", response.data);
      } catch (error) {
        console.error("fetch feeds 에러 : ", error);
      }
    };

    fetchFeeds();
  }, []);

  // 무한 스크롤 구현 시 고려사항
  // 1. 성능 최적화 -> 일정량의 데이터만 로드(데이터 페이징), 지연 로딩
  // 2. 사용자 경험을 위해 로딩 스피너 표시
  // 3. 데이터 중복 방지(캐싱) -> 캐싱을 통해 불필요한 데이터 요청을 줄이기 위해 로컬 스토리지나 세션 스토리지를 사용
  // https://tech.kakaoenterprise.com/149
  // https://f-lab.kr/insight/infinite-scroll-implementation-20240807
  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      // loadMoreData();
      console.log("페이지 넘어서 스크롤 중");
    }
  });

  return (
    <div className={styles.feedList}>
      {feeds.map((feed) => (
        <div key={feed.feedIdx} className={styles.feedItem}>
          <div className={styles.header}>
            <div className={styles.feedInfoContainer}>
              <div className={styles.profileImg}>
                <img src={profileDefaultImage} />
              </div>
              <div className={styles.feedInfo}>
                <div className={styles.wrTime}>
                  <span className={styles.writer}>{feed.id}</span>
                  <span>ㆍ</span>
                  <span className={styles.time}>
                    {elapsedTime(feed.postedAt)}
                  </span>
                </div>
                <div className={styles.location}>{feed.feedLocation}</div>
              </div>
            </div>

            <div className={styles.feedOptionsContainer}>
              <BsThreeDots className={styles.options} />
            </div>
          </div>

          <div className={styles.content}>
            {(() => {
              console.log("피드 타입 확인");
              let content;

              switch (feed.feedType) {
                case "event":
                  content = "일정이 등록되었습니다.";
                  break;
                case "mission":
                  content = "미션이 등록되었습니다.";
                  break;
                default:
                  content = feed.feedContent;
              }
              return content;
            })()}
          </div>

          <div className={styles.footer}>
            <div className={styles.iconbar}>
              <span>
                <BsSuitHeart />
                {feed.feedLikes || 0}
              </span>
              <span>
                <BsChatHeart />0
              </span>
            </div>
            <div className={styles.comment}>
              <textarea rows="1" placeholder="댓글 달기..." />
              <button>게시</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedList;
