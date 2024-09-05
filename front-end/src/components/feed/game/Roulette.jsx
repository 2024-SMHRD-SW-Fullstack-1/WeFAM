import React, { useEffect, useRef, useState } from "react";
import styles from "./Roulette.module.css";

const RouletteModal = ({ onClose }) => {
  const canvasRef = useRef(null); // 캔버스 참조를 위한 useRef
  const [product, setProduct] = useState([
    "햄버거",
    "순대국",
    "정식당",
    "중국집",
    "구내식당",
  ]); // 룰렛에 표시할 항목들
  const [colors, setColors] = useState([]); // 각 항목의 색상
  const [rotationResult, setRotationResult] = useState(null); // 회전 결과

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d"); // 2D 렌더링 컨텍스트 얻기
    const cw = canvasRef.current.width / 2; // 캔버스의 중심 x 좌표
    const ch = canvasRef.current.height / 2; // 캔버스의 중심 y 좌표
    const arc = Math.PI / (product.length / 2); // 각 항목의 호각

    if (colors.length === 0) {
      // 색상이 아직 설정되지 않은 경우
      const newColors = product.map(() => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`; // 랜덤 색상 생성
      });
      setColors(newColors); // 색상 상태 업데이트
    }

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // 캔버스 클리어

    // 항목을 원형으로 그리기
    for (let i = 0; i < product.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length]; // 항목에 색상 적용

      // 첫 번째 항목이 중앙의 세로 선과 일치하도록 시작 각도 조정
      const startAngle = arc * i - Math.PI / 2;
      const endAngle = arc * (i + 1) - Math.PI / 2;

      ctx.moveTo(cw, ch); // 중심으로 이동
      ctx.arc(cw, ch, cw, startAngle, endAngle); // 원호 그리기
      ctx.lineTo(cw, ch); // 중심으로 이동
      ctx.fill(); // 항목 색상 채우기
      ctx.closePath();
    }

    ctx.fillStyle = "#fff"; // 텍스트 색상
    ctx.font = "18px Pretendard"; // 텍스트 폰트
    ctx.textAlign = "center"; // 텍스트 정렬

    // 항목 텍스트를 캔버스에 그리기
    for (let i = 0; i < product.length; i++) {
      // 각 항목의 중앙 각도를 계산
      const angle = arc * i + arc / 2 - Math.PI / 2; // 원호의 중심 각도, 세로 수직선과 일치하도록 조정

      ctx.save(); // 현재 상태 저장

      // 텍스트의 x, y 좌표를 원호의 중심에서 벗어나지 않도록 조정
      ctx.translate(
        cw + Math.cos(angle) * (cw - 50), // 텍스트의 x 좌표
        ch + Math.sin(angle) * (ch - 50) // 텍스트의 y 좌표
      );

      // 텍스트가 각 항목의 중심 방향으로 회전하도록 조정
      ctx.rotate(angle + Math.PI / 2); // 텍스트 회전

      // 텍스트를 항목의 중심에 위치하도록 조정
      ctx.fillText(product[i], 0, 0); // 항목 텍스트 그리기

      ctx.restore(); // 이전 상태 복원
    }
  }, [product, colors]); // product 또는 colors가 변경될 때마다 실행

  const rotate = () => {
    const canvas = canvasRef.current;
    const arc = 360 / product.length; // 각 항목의 회전 각도
    const ran = Math.floor(Math.random() * product.length); // 랜덤 항목 선택
    const rotationAmount = ran * arc + 3600 + Math.floor(Math.random() * 360); // 회전 값 계산 (회전 속도 및 랜덤 추가)

    canvas.style.transition = "transform 2s ease-out"; // 회전 애니메이션 설정
    canvas.style.transform = `rotate(${rotationAmount}deg)`; // 캔버스 회전

    // 결과 계산
    setTimeout(() => {
      const normalizedRotation = rotationAmount % 360; // 회전값을 0-359도 범위로 정규화
      const resultIndex = Math.floor(
        (product.length - (normalizedRotation / 360) * product.length) %
          product.length
      ); // 결과 인덱스 계산
      const result = product[resultIndex]; // 결과 항목
      setRotationResult(result); // 결과 상태 업데이트
      console.log(`결과: ${result}`); // 결과를 콘솔에 출력
    }, 2000); // 애니메이션이 완료된 후 결과를 계산
  };

  const add = () => {
    const menuAdd = document.getElementById("menuAdd");
    if (menuAdd.value) {
      setProduct([...product, menuAdd.value]); // 항목 추가
      const newColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`; // 새 항목의 색상 생성
      setColors([...colors, newColor]); // 색상 상태 업데이트
      menuAdd.value = ""; // 입력 필드 비우기
    } else {
      alert("메뉴를 입력한 후 버튼을 클릭 해 주세요"); // 메뉴를 입력하라는 알림
    }
  };

  return (
    <div className={styles.menu}>
      <canvas
        ref={canvasRef}
        width="600"
        height="600"
        className={styles.canvas}
      />
      <button onClick={rotate} className={styles.button}>
        돌려돌려 돌림판
      </button>
      <div id="addDiv">
        <input type="text" id="menuAdd" />
        <button onClick={add} className={styles.button}>
          메뉴 추가
        </button>
      </div>
      <button onClick={onClose} className={styles.button}>
        닫기
      </button>
    </div>
  );
};

export default RouletteModal;
