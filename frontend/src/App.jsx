import React, { useState } from "react"
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
import ChatPage from "./Pages/ChatPage"
import ProtectedRoute from "./Components/ProtectedRoute"
import Settings from "./Pages/Settings"

function AppLayout() {
  const location = useLocation()
  const hideLayout = location.pathname === "/login" || location.pathname === "/checkout/founding-membership"
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Apply dark background only if layout is shown
  const containerClasses = hideLayout ? "min-h-screen flex flex-col" : "min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col"

  return (
    <div className={containerClasses}>
      {!hideLayout && <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />}

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {!hideLayout && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

        <div className={`flex-1 overflow-y-auto ${hideLayout ? "" : "px-4 py-6"}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/checkout/founding-membership" element={<Membership />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course-details"
              element={
                <ProtectedRoute>
                  <CourseDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <CommunityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
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
