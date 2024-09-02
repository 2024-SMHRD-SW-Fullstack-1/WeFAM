import React, { useState } from 'react';
import styles from './FamilyModal.module.css'
const FamilyModal = ({ user, onClose }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    // 메시지 전송 로직 추가
    console.log(`쪽지 보낼사람 ${user.nick}: ${message}`);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{user.nick} 에게 쪽지 보내기</h2>
        <textarea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="쪽지 내용을 입력하세요..." 
          className={styles.textarea}
        />
        <div className={styles.modalActions}>
          <button onClick={handleSendMessage} className={styles.sendButton}>전송</button>
          <button onClick={onClose} className={styles.closeButton}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default FamilyModal;
