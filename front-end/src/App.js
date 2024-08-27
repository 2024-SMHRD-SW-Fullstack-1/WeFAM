import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Main from "./components/Main";
import Feed from "./components/feed/Feed";
import Calendar from "./components/calendar/Calendar";
import Memo from "./components/memo/Memo";
import Todo from "./components/todo/Todo";
import Recipe from "./components/recipe/Recipe";
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
          <Route path="memo" element={<Memo />} />
          <Route path="todo" element={<Todo />} />
          <Route path="recipe" element={<Recipe />} />
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
