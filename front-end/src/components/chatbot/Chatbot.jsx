import React, { useState, useEffect, useRef } from "react";
import styles from "./Chatbot.module.css";

const Chatbot = ({onClose}) => {
    const [isChatGPT, setIsChatGPT] = useState(true);
    const [isWaitingResponse, setIsWaitingResponse] = useState(false);
    const [chatContent, setChatContent] = useState([]);
    const [userInput, setUserInput] = useState("");
    const chatContainerRef = useRef(null);

    // 최초 환영 메시지 설정
    useEffect(() => {
        setChatContent([
            ...chatContent,
            { message: "안녕하세요! 세계 최고의 가족비서 파미 입니다.", isUserChat: false }
        ]);
    }, []);

    // 토글 버튼 클릭 시 이벤트 처리
    const toggleChat = () => {
        setIsChatGPT(!isChatGPT);
        const message = isChatGPT
            ? "안녕하세요! 푸보다 조금 더 똑똑한 세계 최고의 요리사 디 입니다."
            : "안녕하세요! 세계 최고의 요리사 푸 입니다.";

        setChatContent([...chatContent, { message, isUserChat: false }]);
        scrollToBottom();
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
        setIsWaitingResponse(true);
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
                try {
                    chat(data, false); // 파싱한 데이터 사용
                } catch (error) {
                    console.error("JSON 파싱 오류:", error);
                }
                setIsWaitingResponse(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setIsWaitingResponse(false);
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
                        {chat.message}
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
