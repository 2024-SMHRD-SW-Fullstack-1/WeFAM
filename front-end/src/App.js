import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Feed from "./components/feed/Feed";
import Calendar from "./components/calendar/Calendar";
import HouseWork from "./components/housework/HouseWork";
import Album from "./components/album/Album";
import AlbumFolder from "./components/album/AlbumFolder";
import Login from "./components/login/Login";
import "./css/App.css";
import "./css/Test.css";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Feed />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="housework" element={<HouseWork />} />
          <Route path="album" element={<Album />} />
          <Route path="album/:name" element={<AlbumFolder />} />{" "}
          {/* 동적 경로 추가 */}
        </Route>
        <Route path="login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
