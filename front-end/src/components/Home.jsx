import React from "react";
import { Outlet } from "react-router-dom";

import Header from "./header/Header";
import LeftSidebar from "./left-sidebar/LeftSidebar";
import RightSidebar from "./right-sidebar/RightSidebar";

const Home = () => {
  return (
    <div>
      <Header />
      <LeftSidebar />
      {/* 이 부분에 중첩된 라우트가 렌더링됩니다 */}
      <Outlet />
      <RightSidebar />
    </div>
  );
};

export default Home;
