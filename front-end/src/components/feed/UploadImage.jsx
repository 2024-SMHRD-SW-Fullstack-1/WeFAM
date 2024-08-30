import React, { useState } from "react";
import axios from "axios";

const UploadImage = () => {
  const [files, setFiles] = useState([]);

  const onFileChange = () => {
    setFiles(e.target.files);
  };

  const onUpload = () => {
    const imgData = new ImgData();

    Array.from(files).forEach((file) => {
      ImgData.append("files", file);
    });
  };

  return (
    <div>
      <input type="file" multiple onChange={onFileChange} />
    </div>
  );
};

export default UploadImage;
