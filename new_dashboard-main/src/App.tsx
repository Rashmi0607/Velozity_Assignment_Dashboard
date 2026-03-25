import React from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#faf8ff]">
        <Sidebar />

        <main className="ml-72 flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<div className="p-10">Tasks Page</div>} />
            <Route path="/settings" element={<div className="p-10">Settings Page</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}