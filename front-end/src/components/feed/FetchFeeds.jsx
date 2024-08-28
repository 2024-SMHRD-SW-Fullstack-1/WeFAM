import React from "react";
import axios from "axios";

const FetchFeeds = async () => {
  try {
    const response = await axios.get("http://localhost:8089/wefam/fetch-feeds");
    console.log("fetchFeed 함수 실행 : " + response.data);
    return response.data;
  } catch (error) {
    console.error("fetchFeed 함수 에러 : ", error);
    throw error;
  }
};

export default FetchFeeds;
