import React, { useState, useEffect } from "react";

const DailyMissions = () => {
  // 미션 데이터에 각 미션의 마감 시간을 추가합니다 (예시로 1시간 후로 설정).
  const missions = [
    {
      title: "안전 우선",
      description:
        "한 매치에서 경찰 조끼(Lv. 2)와 헬멧(Lv. 2) 각각 1개씩 획득하기.",
      xp: 800,
      endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // 현재 시간부터 1시간 후
    },
    {
      title: "한국인이 좋아하는 속도",
      description:
        "한 매치에서 매치 시작 후 10분 이내 킬 또는 어시스트 1회 하기.",
      xp: 900,
      endTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2시간 후
    },
    {
      title: "근접전",
      description:
        "기관단총(SMG) 혹은 산탄총(SG)으로 적에게 누적 피해량 100 주기.",
      xp: 1000,
      endTime: new Date(new Date().getTime() + 3 * 60 * 60 * 1000), // 3시간 후
    },
  ];

  const [timeLeft, setTimeLeft] = useState([]);

  // 남은 시간을 계산하는 함수
  const calculateTimeLeft = () => {
    return missions.map((mission) => {
      const now = new Date();
      const difference = mission.endTime - now;

      let timeLeftForMission = {};

      if (difference > 0) {
        timeLeftForMission = {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        timeLeftForMission = { hours: 0, minutes: 0, seconds: 0 };
      }

      return timeLeftForMission;
    });
  };

  // useEffect를 사용해 남은 시간을 주기적으로 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000); // 1초마다 업데이트

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='main'>
      <div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          남은 시간 {new Date() + 1 - new Date().toLocaleTimeString()}{" "}
          {/* 현재 시간만 표시 */}
        </div>
        <div
          style={{
            padding: "0 20px",
            display: "flex",
            flexDirection: "column",
          }}>
          <h2>데일리 미션</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {missions.map((mission, index) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  border: "1px solid black",
                  borderRadius: "8px",
                }}>
                <h3>{mission.title}</h3>
                <p>{mission.description}</p>
                <p>XP: {mission.xp}</p>
                <p>
                  남은 시간:{" "}
                  {timeLeft[index]
                    ? `${timeLeft[index].hours}시간 ${timeLeft[index].minutes}분 ${timeLeft[index].seconds}초`
                    : "계산 중..."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMissions;
