import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import PortfolioPage from "./pages/PortfolioPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
