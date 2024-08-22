import Header from "./components/Header.jsx";
import RightSidebar from "./components/RightSidebar.jsx";
import LeftSidebar from "./components/LeftSidebar.jsx";
import main from "./components/Main.jsx"
import "./css/App.module.css";
import "./css/Test.css";
import Calendar from "./components/calendar/Calendar.jsx"

function App() {
  return (
    <div className="App">
      {/* <Header></Header> */}
      <Calendar/>
      {/* <LeftSidebar/> */}
      {/* <Main/> */}
      {/* <RightSideBar/> */}
      {/* <div className="color-box color-coral">Coral</div>
      <div className="color-box color-peach">Peach</div>
      <div className="color-box color-maize">Maize</div>
      <div className="color-box color-turquoise-green">Turquoise Green</div>
      <div className="color-box color-pale-blue">Baby Blue</div>
      <hr />
      <p class="font-sm">This is font-sm (0.875rem)</p>
      <p class="font-md">This is font-md (1.0rem)</p>
      <p class="font-lg">This is font-lg (1.125rem)</p>
      <p class="font-xl">This is font-xl (1.25rem)</p>
      <p class="font-2xl">This is font-2xl (1.375rem)</p>
      <p class="font-3xl">This is font-3xl (1.5rem)</p>
      <p class="font-4xl">This is font-4xl (2.0rem)</p> */}
    </div>
  );
}

export default App;
