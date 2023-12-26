import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login"
import OpenRoute from "./components/core/Auth/OpenRoute";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <div className="w-screen min-h-screen font-inter bg-richblack-900 flex flex-col">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route
          path="/signup" element={
            <OpenRoute>
              <Signup/>
            </OpenRoute>
          }
        />
        <Route
          path="/login" element={
            <OpenRoute>
              <Login/>
            </OpenRoute>
          }
        />
        <Route
          path="/forgot-password" element={
            <OpenRoute>
              <ForgotPassword/>
            </OpenRoute>
          }
        />
        <Route
          path="/update-password/:id" element={
            <OpenRoute>
              <UpdatePassword/>
            </OpenRoute>
          }
        />
        <Route
          path="/verify-email" element={
            <OpenRoute>
              <VerifyEmail/>
            </OpenRoute>
          }
        />
        <Route
          path="/about" element={
            <OpenRoute>
              <About/>
            </OpenRoute>
          }
        />
        <Route
          path="/contact" element={
            <OpenRoute>
              <Contact/>
            </OpenRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
