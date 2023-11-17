import "./App.css";
import About from "./components/About";
import Apis from "./components/Apis";
import Contact from "./components/Contact";
import Main from "./components/Main";
import Projects from "./components/Projects";
import Sidenav from "./components/Sidenav";
import Skills from "./components/Skills";

function App() {
  return (
    <>
      <div>
        <Sidenav />
        <Main />
        <About />
        <Skills />
        <Projects />
        <Apis />
        <Contact />
      </div>
    </>
  );
}

export default App;
