import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Main from "./components/Main";
import Calendar from "./components/calendar/Calendar";
import Memo from "./components/memo/Memo";
import Todo from "./components/todo/Todo";
import Recipe from "./components/recipe/Recipe";
import Galary from "./components/galary/Galary";
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
          <Route path="todo" element={<Todo />} />
          <Route path="recipe" element={<Recipe />} />
          <Route path="galary" element={<Galary />} />
        </Route>
        <Route path="login" element={<LogIn />} />
      </Routes>
    </div>
  );
}

export default App;
