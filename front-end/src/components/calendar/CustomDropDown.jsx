import React, { useState } from "react";
import Select from "react-select";
import { BsTagFill } from "react-icons/bs"; // 아이콘

const CustomDropdown = ({ options, placeholder = "선택하세요", onChange }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 490,
      alignItems: "center",
      boder: "1px solid #e0e0e0",
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
  };

  const formatOptionLabel = ({ label, color }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <BsTagFill style={{ color, marginRight: "10px" }} />
      <span>{label}</span>
    </div>
  );

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    onChange(selectedOption); // 선택된 값을 상위로 전달
  };

  return (
    <Select
      value={selectedOption}
      onChange={handleChange}
      options={options}
      styles={customStyles}
      formatOptionLabel={formatOptionLabel}
      placeholder={placeholder}
    />
  );
};

export default CustomDropdown;
