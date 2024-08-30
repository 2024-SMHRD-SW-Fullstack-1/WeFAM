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
      imgData.append("files", file);
    });

    axios
      .post("http://localhost:8089/wefam/add-feed-img", imgData, {
        headers: {
          "Content-Type": "multipart/img-data",
        },
      })
      .then((response) => {
        console.log("Files uploaded successfully");
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
  };

  return (
    <div>
      <input type="file" multiple onChange={onFileChange} />
      <button onClick={onUpload}>Upload</button>
    </div>
  );
};

export default UploadImage;
