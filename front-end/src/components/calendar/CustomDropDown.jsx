import React from "react";
import Select from "react-select";
import { BsTagFill } from "react-icons/bs"; // 아이콘

const CustomDropdown = ({ options, placeholder, onChange, value }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 490,
      alignItems: "center",
      boder: "0px solid #c02727",
      boderRadius: "10px",
      backgroundColor: "#f9f9f9" /* 박스 배경색 */,
    }),
    option: (provided, { data, isSelected }) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      color: isSelected ? "#fff" : "#333",
      backgroundColor: isSelected ? data.color : "#fff",
      ":hover": {
        backgroundColor: data.color,
        color: "#fff",
      },
    }),
    singleValue: (provided, { data }) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      color: data.color,
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // 드롭다운 메뉴가 다른 요소들 위에 위치하도록 설정
    }),
  };

  const formatOptionLabel = ({ label, color }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <BsTagFill style={{ color, marginRight: "10px" }} />
      <span>{label}</span>
    </div>
  );

  return (
    <Select
      value={value} // 상위에서 선택된 값을 전달
      onChange={onChange}
      options={options}
      styles={customStyles}
      formatOptionLabel={formatOptionLabel}
      placeholder={placeholder} // 기본 placeholder 전달
    />
  );
};

export default CustomDropdown;
