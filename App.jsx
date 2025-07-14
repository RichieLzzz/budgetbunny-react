// src/App.jsx
import ThemeProvider from "./context/ThemeContext"
import { Routes, Route } from "react-router-dom"
import Home     from "./pages/Home.jsx"
import Login    from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Dashboard from "./pages/Dashboard.jsx"

export default function App() {
  return (
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register"element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
  )
}
