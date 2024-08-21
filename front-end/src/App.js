import Navbar from "./components/Header";
import "./css/App.module.css";
import "./css/Test.css";

function App() {
  return (
    <div className="App">
      <Header></Header>
      <LeftSidebar></LeftSidebar>
      <Main></Main>
      <RightSidebar></RightSidebar>
      <div className="color-box color-coral">Coral</div>
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
      <p class="font-4xl">This is font-4xl (2.0rem)</p>
    </div>
  );
}

export default App;
