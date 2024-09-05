import React, { useState } from 'react';
import styles from '../modal/Modal.module.css';
import style from './AiModal.module.css'
import mountain from '../../assets/images/mountains.png'
import inside from '../../assets/images/inside.png'
import festival from '../../assets/images/festival.png'
import activity from '../../assets/images/gliding.png'

const AiModal = ({ onClose }) => {
    const [selectedTheme, setSelectedTheme] = useState(null);

    const themes = [
        { id: 1, name: '산', image: mountain },
        { id: 2, name: '실내여행지', image: inside },
        { id: 3, name: '액티비티', image: activity },
        { id: 4, name: '축제', image: festival },
        { id: 5, name: '상관없음', image: null }
    ];

    const handleThemeClick = (theme) => {
        setSelectedTheme(theme);
    };

    const handleComplete = () => {
        if (selectedTheme) {
            alert(`선택한 테마: ${selectedTheme.name}`);
        } else {
            alert('테마를 선택해 주세요.');
        }
    };
    const handleClose = () => {
        onClose();
    }

    return (
        <div className={styles.modal}>
            <div className={style.aimodal}>
                <div className={style.themeHead}>
                    <h1>가족이 원하는 여행 테마를 1개 선택해 주세요.</h1>
                </div>
                <div className={style.themeContainer}>
                    {themes.map((theme) => (
                        <div
                            key={theme.id}
                            className={`${style.theme} ${selectedTheme?.id === theme.id ? style.selected : ''}`}
                            onClick={() => handleThemeClick(theme)}
                        >
                            {theme.image && (
                                <img src={theme.image} alt={theme.name} className={style.themeImage} />
                            )}
                            {<div className={style.themeName}>{theme.name}</div>}
                        </div>
                    ))}
                </div>
                <div className={style.buttonContainer}>
                    <button className={style.cancelButton} onClick={handleClose}>취소</button>
                    <button className={style.completeButton} onClick={handleComplete}>완료</button>
                </div>
            </div>
        </div>
    );
};

export default AiModal;
