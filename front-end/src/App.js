import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Main from "./components/Main";
import Calendar from "./components/calendar/Calendar";
import Memo from "./components/memo/Memo";
import HouseWork from "./components/housework/HouseWork";
import Recipe from "./components/recipe/Recipe";
import Gallery from "./components/album/Gallery";
import Album from "./components/album/Album";
import LogIn from "./components/login/LogIn";

import "./css/App.css";
import "./css/Test.css";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Main />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="memo" element={<Memo />} />
          <Route path="housework" element={<HouseWork />} />
          <Route path="recipe" element={<Recipe />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="album" element={<Album />} /> {/* 동적 경로 추가 */}
        </Route>
        <Route path="login" element={<LogIn />} />
      </Routes>
    </div>
  );
}

export default App;