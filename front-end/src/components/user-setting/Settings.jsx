import React, { useState } from 'react';
import PersonalInfo from './PersonalInfo';
import FamilyManagement from './FamilyManagement';
import GroupManagement from './GroupManagement';
import styles from './Settings.module.css';

const Settings = () => {
  const [activeMenu, setActiveMenu] = useState('personal-info');

  const renderContent = () => {
    switch (activeMenu) {
      case 'personal-info':
        return <PersonalInfo />;
      case 'family-management':
        return <FamilyManagement />;
      case 'group-management':
        return <GroupManagement />;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <div className='main'>
    <div className={styles.settingsPage}>
      <div className={styles.menu}>
        <ul>
          <li onClick={() => setActiveMenu('personal-info')} className={activeMenu === 'personal-info' ? styles.active : ''}>개인정보 관리</li>
          <li onClick={() => setActiveMenu('family-management')} className={activeMenu === 'family-management' ? styles.active : ''}>가족 구성원 관리</li>
          <li onClick={() => setActiveMenu('group-management')} className={activeMenu === 'group-management' ? styles.active : ''}>그룹 관리</li>
        </ul>
      </div>
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
    </div>
  );
};

export default Settings;
