import React, { useState, useRef } from "react";
import "./roulette.css"; // CSS 파일 임포트
// 룰렛 컴포넌트
const Roulette = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // 랜덤 숫자 생성 함수
  const rRandom = () => {
    // 참여 인원
    const rolLength = 6;
    const min = Math.ceil(0);
    const max = Math.floor(rolLength - 1);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // 룰렛 회전 함수
  const rRotate = () => {
    if (isSpinning) return; // 이미 회전 중이면 무시

    setIsSpinning(true);
    buttonRef.current.disabled = true;

    const rolLength = 6;
    const deg = Array.from(
      { length: rolLength },
      (_, i) => (360 / rolLength) * (i + 1)
    );
    const num = rRandom();

    let count = 0;
    const interval = setInterval(() => {
      count++;
      panelRef.current.style.transform = `rotate(${360 * count}deg)`;

      // 회전이 끝나면
      if (count === 50) {
        clearInterval(interval);
        panelRef.current.style.transition = "transform 5s ease-out";
        panelRef.current.style.transform = `rotate(${deg[num]}deg)`;

        // 결과에 따른 팝업 처리
        setTimeout(() => {
          rLayerPopup(num);
          setIsSpinning(false);
          buttonRef.current.disabled = false;
        }, 5000); // 애니메이션 후 팝업
      }
    }, 50);
  };

  // 결과에 따른 팝업 처리 함수
  const rLayerPopup = (num) => {
    switch (num) {
      case 1:
        alert("당첨!! 스타벅스 아메리카노");
        break;
      case 3:
        alert("당첨!! 햄버거 세트 교환권");
        break;
      case 5:
        alert("당첨!! CU 3,000원 상품권");
        break;
      default:
        alert("꽝! 다음 기회에");
    }
  };

  return (
    <div className="rouletter">
      <div className="rouletter-bg">
        <div className="rouletter-wacu" ref={panelRef}></div>
        {/* 참여자 설정 */}
        <div></div>
      </div>
      <div className="rouletter-arrow"></div>
      <button
        className="rouletter-btn"
        ref={buttonRef}
        onClick={rRotate}
        disabled={isSpinning}
      >
        Start
      </button>
    </div>
  );
};

export default Roulette;
