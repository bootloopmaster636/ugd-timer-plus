import { invoke } from "@tauri-apps/api/tauri";
import { BrowserRouter as Router, Routes, Route }
  from 'react-router-dom';
import Timer from "./pages/timer.tsx";

function App() {
  return (
    <Router>
      <Timer />
    </Router>
  );
}

export default App;
