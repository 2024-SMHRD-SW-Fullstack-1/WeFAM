import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Feed from "./components/feed/Feed";
import Calendar from "./components/calendar/Calendar";
import HouseWork from "./components/housework/HouseWork";
import AlbumFolder from "./components/album/AlbumFolder";
import Login from "./components/login/Login";
import Settings from "./components/user-setting/Settings";
import HouseWork2 from "./components/housework/HouseWork2";
import Recipe from "./components/recipe/Recipe";
import AddRecipe from "./components/recipe/AddRecipe";
import DailyMission from "./components/housework/DailyMission";
import { MemoModal } from "./components/calendar/MemoModal";

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
          <Route path="housework" element={<HouseWork />} />
          <Route path="recipe" element={<Recipe />} />
          <Route path="recipe/add" element={<AddRecipe />} />
          <Route path="album" element={<AlbumFolder />} />
          <Route path="settings" element={<Settings />} />
          <Route path="housework2" element={<HouseWork2 />} />
          <Route path="dailyMission" element={<DailyMission />} />
          <Route path="memo" element={<MemoModal />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
