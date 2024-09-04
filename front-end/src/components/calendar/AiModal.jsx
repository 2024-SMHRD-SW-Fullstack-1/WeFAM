import React, { useState } from 'react';
import Styles from './AiModal.module.css';

const AiModal = () => {
  const [selectedTheme, setSelectedTheme] = useState(null);

  const themes = [
    { id: 1, name: '산' },
    { id: 2, name: '실내여행지' },
    { id: 3, name: '액티비티' },
    { id: 4, name: '축제' }
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

  return (
    <div className={Styles.modal}>
      <h2>원하는 여행 테마를 1개 선택해 주세요.</h2>
      <div className={Styles.themeContainer}>
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`${Styles.theme} ${selectedTheme?.id === theme.id ? Styles.selected : ''}`}
            onClick={() => handleThemeClick(theme)}
          >
            {theme.name}
          </div>
        ))}
      </div>
      <button className={Styles.completeButton} onClick={handleComplete}>
        완료
      </button>
    </div>
  );
};

export default AiModal;
