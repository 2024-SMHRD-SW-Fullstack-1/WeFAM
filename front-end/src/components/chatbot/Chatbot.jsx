import React, { useState, useEffect, useRef } from "react";
import styles from "./Chatbot.module.css";
import { useSelector } from "react-redux";


const Chatbot = ({ onClose, theme, startDate, endDate, location, onSelectPlace }) => {
    const [isChatGPT, setIsChatGPT] = useState(true);
    const [isWaitingResponse, setIsWaitingResponse] = useState(false);
    const [chatContent, setChatContent] = useState([]);
    const [userInput, setUserInput] = useState("");
    const chatContainerRef = useRef(null);
    const locationInput = useSelector((state) => state.locationInput.locationInput); // 리덕스 상태 가져오기
    // 최초 환영 메시지 설정
    useEffect(() => {
        console.log("장소 :" + location);
        console.log("테마 :" + theme);
        console.log("시작 :" + startDate);
        console.log("종료 :" + endDate);
        console.log("입력만 받은 장소 : " + locationInput)


        setChatContent([
            ...chatContent,
            { message: "안녕하세요! 세계 최고의 가족비서 파미 입니다.", isUserChat: false }
        ]);


        // 조건을 만족할 때 AI 서버로 요청
        if (theme && startDate && location && endDate) {
            sendChatToServer(`우리 가족이 고른 여행테마는 ${theme}이고, 선택한 날짜는 ${startDate}부터 ${endDate}이고 고른 장소는 ${location}야. 
                고른 테마와 날짜, 장소에 맞춰 선택한 장소 주변에 추천해줄 세가지 장소명칭을 알려주고 영어로는 알려주지 않아도돼. 세가지를 알려줄 땐
                1. **(장소명칭)** 이런식으로 3번까지 알려주고 줄바꿈해서 부가설명을 해줘.
                만약 축제테마를 골랐다면 축제가 열리는 장소명칭 **장소명칭** 이렇게 알려주고 축제정보가는  그 밑에 해당 축제에대한 설명을해주면돼. `);
        }
    }, []);

    // 날짜 형식 변환 함수
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 장소를 클릭했을 때 이벤트 핸들러
    const handlePlaceClick = (fullResponse) => {
        if (typeof onSelectPlace === 'function') {
            // EventModal의 메모 필드에 선택된 장소와 설명을 넣음
            onSelectPlace(fullResponse);
            console.log("클릭한 장소와 설명: " + fullResponse);

            // AiModal과 Chatbot 모달을 닫음
            onClose();

        } else {
            console.error("onSelectPlace 함수가 전달되지 않았습니다.");
        }
        setChatContent([...chatContent, { message: `선택하신 장소는 ${fullResponse}입니다!`, isUserChat: false }]);
    };

    // 사용자가 입력한 메시지 보내기
    const startChat = () => {
        if (userInput.trim() !== "") {
            chat(userInput, true);
            setUserInput("");
        }
    };

    // 서버로 메시지를 보내고 응답을 받는 함수
    const sendChatToServer = (message) => {
        setChatContent([...chatContent, { message: "AI가 답변 중...", isUserChat: false }]);

        // 서버 요청
        fetch("http://localhost:8089/wefam/chatbot/hitopenaiapi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        })
            .then((response) => response.text())
            .then((data) => {
                const formattedStartDate = formatDate(startDate);
                const formattedEndDate = formatDate(endDate);

                const messageWithPlaces = data.split("\n");
                const firstMessage = `${formattedStartDate}부터 ${formattedEndDate}까지 여행을 계획중이시군요!💕`
                setChatContent((prevContent) => [
                    ...prevContent,
                    { message: firstMessage, isUserChat: false }, // 첫 번째 메시지
                    { message: data, isUserChat: false, aiResponse: messageWithPlaces }, // 두 번째 메시지, 장소 목록 처리
                ]);
                scrollToBottom();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };


    // 대화창에 메시지 추가하는 함수
    const chat = (message, isUserChat) => {
        setChatContent([...chatContent, { message, isUserChat }]);
        if (isUserChat) {
            sendChatToServer(message);
        }
        scrollToBottom();
    };

    // 채팅창 스크롤 맨 아래로 이동
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    // 키보드 Enter 입력으로 메시지 전송
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            startChat();
        }
    };
    const handleClose = () => {
        onClose();
    };

    return (
        <div className={styles.chatbot__wrapper}>
            {/* 모달 닫기 버튼 */}
            <div className={styles.closeButton} onClick={handleClose}>
                &times;
            </div>

            <div className={styles.chatbot__header}>
                AI 답변중
            </div>

            <div className={styles.chatbot__content} ref={chatContainerRef}>
                {chatContent.map((chat, index) => (
                    <div className={styles.chatbot__content__box} key={index}>
                        {chat.aiResponse ? (
                            chat.aiResponse.map((line, idx) => {

                                let fullResponse = null;

                                // (숫자). **장소명** 과 그 뒤의 설명까지 모두 추출
                                const matchFull = line.match(/\d+\.\s*\*\*(.*?)\*\*\s*[-:]?\s*(.*)/); // 장소명과 설명을 모두 추출

                                if (matchFull) {
                                    fullResponse = `${matchFull[1].trim()}: ${matchFull[2].trim()}`; // 장소명과 설명을 합쳐 하나의 문자열로
                                }

                                if (fullResponse) {
                                    return (
                                        <React.Fragment key={idx}>
                                            <span
                                                onClick={() => handlePlaceClick(fullResponse)} // 응답 전체를 메모에 넣기 위한 처리
                                                style={{
                                                    cursor: "pointer",
                                                    color: "black",
                                                    fontWeight: "bold"
                                                }}>
                                                {line}
                                            </span>
                                            <br />
                                        </React.Fragment>
                                    );
                                }
                                return (
                                    <React.Fragment key={idx}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            chat.message.split("\n\n").map((line, idx) => (
                                <React.Fragment key={idx}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))
                        )}
                    </div>
                ))}


            </div>

            <div className={styles.chatbot__footer}>
                <div className={styles.footer__input__container}>
                    <input
                        type="text"
                        className={styles.input__container__type}
                        placeholder="Write Something..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    <button className={styles.input__container__sendBtn} onClick={startChat}>
                        SEND
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
