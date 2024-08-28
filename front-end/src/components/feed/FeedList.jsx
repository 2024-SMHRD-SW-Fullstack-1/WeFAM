import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./FeedList.module.css";
import { elapsedTime } from "../../elapsedTime";

import profileDefaultImage from "../../assets/images/profile-default-image.png";
import { BsSuitHeart } from "react-icons/bs";
import { BsChatHeart } from "react-icons/bs";
import { BsThreeDots } from "react-icons/bs";

const FeedList = () => {
  let num = 0;
  const [feedSize, setFeedSize] = useState(0);
  const [feeds, setFeeds] = useState([]);
  const [visibleOptions, setVisibleOptions] = useState({});

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

  function editFeed() {
    alert("수정 클릭");
  }

  function deleteFeed() {
    alert("삭제 클릭");
  }

  // 옵션창 열고 닫기
  const toggleOptions = (feedIdx) => {
    setVisibleOptions((prev) => {
      // 모든 피드의 옵션을 false로 설정
      const newOptions = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      // 선택된 feedIdx의 옵션만 true로 설정
      return {
        ...newOptions,
        [feedIdx]: true,
      };
    });
  };

  // 어떤 옵션창 열려있는 지 확인해보기
  useEffect(() => {
    console.log("Visible Options changed: ", visibleOptions);
  }, [visibleOptions]);

  // 옵션창이 아닌 다른 영역을 선택했을 때 옵션창
  useEffect(() => {
    const handleClickOutside = (e) => {
      // 모든 옵션 버튼을 선택하기 위한 클래스 이름 가져오기
      const optionsButtons = document.querySelectorAll(".option");

      // 클릭된 요소가 옵션 버튼의 자식이거나 버튼 자체인 경우를 체크
      const isClickInsideOptions = Array.from(optionsButtons).some((button) =>
        button.contains(e.target)
      );

      // 클릭된 위치가 옵션 버튼 내부가 아닌 경우, 모든 옵션을 닫기
      if (!isClickInsideOptions) {
        setVisibleOptions({});
      }
    };

    // 마운트 시 클릭 이벤트 리스너 추가
    document.addEventListener("mousedown", handleClickOutside);

    // 언마운트 시 클릭 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

            <button
              className={styles.feedOptionsContainer}
              onClick={() => toggleOptions(feed.feedIdx)}
            >
              <BsThreeDots />
              {visibleOptions[feed.feedIdx] ? (
                <ul className={styles.options}>
                  <li>
                    <button className="option">수정</button>
                  </li>
                  <li>
                    <button className="option">삭제</button>
                  </li>
                </ul>
              ) : null}
            </button>
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
