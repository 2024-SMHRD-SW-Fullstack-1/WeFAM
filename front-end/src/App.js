import Header from "./components/Header";
import LeftSidebar from "./components/LeftSidebar";
import Main from "./components/Main";
import RightSidebar from "./components/RightSidebar";
import "./css/App.module.css";
import "./css/Test.css";
import Calendar from "./components/calendar/Calendar";

function App() {
  return (
    <div className="App">
      {/* <Header></Header>
      <LeftSidebar></LeftSidebar> */}
      <Calendar/>
      {/* <Main></Main> */}
      {/* <RightSidebar></RightSidebar> */}
    </div>
  );
}

export default App;
