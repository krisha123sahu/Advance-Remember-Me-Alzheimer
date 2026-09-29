import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import FaceRecognition from "./pages/FaceRecognition";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PatientProfile from "./pages/PatientProfile";
import MemoryPeople from "./pages/MemoryPeople";
import Reminders from "./pages/Reminders";
import AICareAssistant from "./pages/AICareAssistant";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<SignUp />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/face-recognition" element={<FaceRecognition />} />

        <Route
          path="/patient-profile"
          element={<PatientProfile />}
        />

        <Route
          path="/memory-people"
          element={<MemoryPeople />}
        />

        <Route
          path="/reminders"
          element={<Reminders />}
        />

        <Route
         path="/ai-assistant"
         element={<AICareAssistant />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;