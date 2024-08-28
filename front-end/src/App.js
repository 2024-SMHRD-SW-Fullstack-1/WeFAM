import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Feed from "./components/feed/Feed";
import Calendar from "./components/calendar/Calendar";
import Memo from "./components/memo/Memo";
import HouseWork from "./components/housework/HouseWork";
import Album from "./components/album/Album";
import AlbumFolder from "./components/album/AlbumFolder";
import LogIn from "./components/login/LogIn";
import RightSidebar from "./components/right-sidebar/RightSidebar";
import "./css/App.css";
import "./css/Test.css";
function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />}>
          <Route index element={<Feed />} />
          <Route path='calendar' element={<Calendar />} />
          <Route path='memo' element={<Memo />} />
          <Route path='housework' element={<HouseWork />} />
          <Route path='album' element={<Album />} />
          <Route path='album/:name' element={<AlbumFolder />} />{" "}
          {/* 동적 경로 추가 */}
        </Route>
          <Route path='*' element={<RightSidebar />} /> {/* RightSidebar 추가 */}
        <Route path='login' element={<LogIn />} />
      </Routes>
    </div>
  );
}

export default App;
