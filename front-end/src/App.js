import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Feed from "./components/feed/Feed";
import Calendar from "./components/calendar/Calendar";
import AlbumFolder from "./components/album/AlbumFolder";
import Login from "./components/login/Login";
import Settings from "./components/user-setting/Settings";
import HouseWork2 from "./components/housework/HouseWork2";
import Meal from "./components/meal/Meal";
import { MemoModal } from "./components/calendar/MemoModal";
import Reward from "./components/header/Reward";
import Chatbot from "./components/chatbot/Chatbot";

import "./css/App.css";
import "./css/Test.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="main" element={<Home />}>
          <Route index element={<Feed />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="meal" element={<Meal />} />
          <Route path="album" element={<AlbumFolder />} />
          <Route path="settings" element={<Settings />} />
          <Route path="housework2" element={<HouseWork2 />} />
          <Route path="memo" element={<MemoModal />} />
          <Route path="reward" element={<Reward />} />
          <Route path="chatbot" element={<Chatbot />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
