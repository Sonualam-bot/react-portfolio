import "./App.css";
import About from "./components/About";
import Contact from "./components/Contact";
import Main from "./components/Main";
import Projects from "./components/Projects";
import Sidenav from "./components/Sidenav";
import Skills from "./components/Skills";
import Work from "./components/Work";

function App() {
  return (
    <>
      <div>
        <Sidenav />
        <Main />
        <About />
        <Skills />
        <Projects />
        <Work />
        <Contact />
      </div>
    </>
  );
}

export default App;
