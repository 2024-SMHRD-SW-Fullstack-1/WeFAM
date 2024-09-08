import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './ProfileModal.module.css';

Modal.setAppElement("#root");

const emojis = ['👩', '👨', '👧', '🧑','👴','🧓']; // 이모티콘 선택 목록

const ProfileModal = ({ isOpen, onRequestClose, profile, isEditing, handleInputChange, handleSaveChanges }) => {
  const [selectedEmoji, setSelectedEmoji] = useState(''); // 선택된 이모티콘 상태
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // 이모티콘 선택창 표시 상태

  // 이모티콘을 닉네임에서 제거하고 새로운 이모티콘을 추가하는 함수
const handleEmojiClick = (emoji) => {
  const regex = new RegExp('[' + emojis.join('') + ']', 'g'); // 이전에 선택한 모든 이모티콘 제거를 위한 정규식
  const updatedNick = profile.nick.replace(regex, ''); // 기존 이모티콘 모두 제거
  setSelectedEmoji(emoji); // 새로운 이모티콘 상태 저장
  handleInputChange({ target: { name: 'nick', value: emoji + updatedNick } }); // 새로운 이모티콘 추가
  setShowEmojiPicker(false); // 이모티콘 선택창 닫기
};

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="프로필 보기"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2 className={styles.modalTitle}>
        {isEditing ? "내 프로필 수정" : `${profile.name}의 프로필`}
      </h2>

      <div className={styles.profileContainer}>
        <img src={profile.profileImg} alt="Profile" className={styles.profileImage} />
        <div className={styles.profile}>
          <div className={styles.profileInfoRow}>
            <label className={styles.modalLabel}>이름 :</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className={`${styles.modalInput} ${styles.modalInputText}`}
              />
            ) : (
              <p>{profile.name}</p>
            )}
          </div>
          <div className={styles.profileInfoRow}>
            <label className={styles.modalLabel}>생년월일 :</label>
            {isEditing ? (
              <input
                type="date"
                name="birth"
                value={profile.birth}
                onChange={handleInputChange}
                className={`${styles.modalInput} ${styles.modalInputDate}`}
              />
            ) : (
              <p>{profile.birth}</p>
            )}
          </div>
          <div className={styles.profileInfoRow}>
            <label className={styles.modalLabel}>닉네임 :</label>
            {isEditing ? (
              <div className={styles.what}>
                {/* 이모티콘 선택 토글 버튼 */}
                <div className={styles.emojiSelector}>
                  <span onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ cursor: 'pointer' }}>
                    (선택)
                  </span>
                  {showEmojiPicker && (
                    <div className={styles.emojiPicker}>
                      {emojis.map((emoji) => (
                        <span
                          key={emoji}
                          className={styles.emoji}
                          onClick={() => handleEmojiClick(emoji)}
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  name="nick"
                  value={selectedEmoji + profile.nick.replace(selectedEmoji, '')} // 중복 방지
                  onChange={handleInputChange}
                 className={`${styles.modalInput} ${styles.modalInputText}`}
                />
              </div>
            ) : (
              <p>{profile.nick}</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        {isEditing && (
          <button onClick={handleSaveChanges} className={styles.saveBtn}>
            저장
          </button>
        )}
        <button onClick={onRequestClose} className={styles.closeBtn}>
          닫기
        </button>
      </div>
    </Modal>
  );
};

export default ProfileModal;
