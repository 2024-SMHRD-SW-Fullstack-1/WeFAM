import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Feed from "./components/feed/Feed";
import Calendar from "./components/calendar/Calendar";
import HouseWork from "./components/housework/HouseWork";
import AlbumFolder from "./components/album/AlbumFolder";
import Login from "./components/login/Login";
import RightSidebar from "./components/right-sidebar/RightSidebar";
import Settings from "./components/user-setting/Settings";
import Housework2 from "./components/housework/Housework2";
import "./css/App.css";
import "./css/Test.css";
function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='main' element={<Home />}>
          <Route index element={<Feed />} />
          <Route path='calendar' element={<Calendar />} />
          <Route path='housework' element={<HouseWork />} />
          <Route path='album' element={<AlbumFolder />} />
          <Route path='settings' element={<Settings />} />
          <Route path='housework2' element={<Housework2 />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
