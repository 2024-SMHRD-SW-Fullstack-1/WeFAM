import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Main from "./components/Main";
import Memo from "./components/memo/Memo";
import Recipe from "./components/Recipe";
import "./css/App.module.css";
import "./css/Test.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}>
          {/* 중첩된 라우트들 */}
          <Route index element={<Main />} />
          <Route path="memo" element={<Memo />} />
          <Route path="recipe" element={<Recipe />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
