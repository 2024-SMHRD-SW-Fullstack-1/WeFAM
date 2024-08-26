import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Main from "./components/Main";
import Feed from "./components/feed/Feed";
import Calendar from "./components/calendar/Calendar";
import Memo from "./components/memo/Memo";
import Todo from "./components/todo/Todo";
import Recipe from "./components/recipe/Recipe";
import Gallery from "./components/gallery/Gallery";
import GalleryFolder from "./components/gallery/GalleryFolder";
import LogIn from "./components/login/LogIn";
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
          <Route path="gallery" element={<Gallery />} />
          <Route path="gallery/:name" element={<GalleryFolder />} />{" "}
          {/* 동적 경로 추가 */}
        </Route>
        <Route path="login" element={<LogIn />} />
      </Routes>
    </div>
  );
}

export default App;
