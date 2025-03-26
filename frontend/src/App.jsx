import React from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import "./App.css"
import Home from "./Pages/Home"
import Navbar from "./Components/Navbar"
import Sidebar from "./Components/Sidebar"
import Courses from "./Pages/Courses"
import CourseDetails from "./Pages/CourseDetails"
import CommunityPage from "./Pages/CommunityPage"
import Login from "./Pages/Login"
import Membership from "./Pages/Membership"

import { useEffect } from "react"

// Component to wrap routes with layout
function AppLayout() {
  const location = useLocation()
  const hideLayout = location.pathname === "/login" || location.pathname === "/checkout/founding-membership"

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {!hideLayout && <Navbar />}
      <div style={{ display: "flex", flex: 1 }}>
        {!hideLayout && <Sidebar />}
        <div style={{ flex: 1, overflowY: "auto" }} className="bg-black">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/checkout/founding-membership" element={<Membership />} />
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course-details" element={<CourseDetails />} />
            <Route path="/community" element={<CommunityPage />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
