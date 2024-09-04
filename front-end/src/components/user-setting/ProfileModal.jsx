import React from 'react';
import Modal from 'react-modal';
import styles from './ProfileModal.module.css';

Modal.setAppElement("#root");

const ProfileModal = ({ isOpen, onRequestClose, profile, isEditing, handleInputChange, handleSaveChanges }) => {
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
            <label className={styles.modalLabel}>이름  :</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className={styles.modalInputText}
              />
            ) : (
              <p>{profile.name}</p>
            )}
          </div>
          <div className={styles.profileInfoRow}>
            <label className={styles.modalLabel}>생년월일  :</label>
            {isEditing ? (
              <input
                type="date"
                name="birth"
                value={profile.birth}
                onChange={handleInputChange}
                className={styles.modalInputDate}
              />
            ) : (
              <p>{profile.birth}</p>
            )}
          </div>
          <div className={styles.profileInfoRow}>
            <label className={styles.modalLabel}>닉네임 :</label>
            {isEditing ? (
              <input
                type="text"
                name="nick"
                value={profile.nick} 
                onChange={handleInputChange}
                className={styles.modalInputText}
              />
            ) : (
              <p>{profile.nick}</p>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div>
          <label className={styles.modalLabel}>프로필 이미지:</label>
          <input
            type="file"
            name="profileImage"
            onChange={(e) =>
              handleInputChange({
                target: {
                  name: "profileImage",
                  value: URL.createObjectURL(e.target.files[0])
                }
              })
            }
            className={styles.modalInputFile}
          />
        </div>
      )}
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
