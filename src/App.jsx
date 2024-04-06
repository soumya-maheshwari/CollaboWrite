import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import CodeEditor from "./pages/CodeEditor";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomID" element={<CodeEditor />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
