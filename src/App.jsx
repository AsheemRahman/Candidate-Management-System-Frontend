import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminLogin from './components/Admin/AdminLogin';
import CandidateLogin from './components/Candidate/CandidateLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import CandidateProfile from './components/Candidate/CandidateProfile';
import CandidateHeader from './components/Candidate/CandidateHeader'
import PrivateRoute from './components/Candidate/PrivateRoute'
import AdminRoute from './components/Admin/AdminPrivateRoute'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from './components/Candidate/CandidateHome';
import CandidateDetails from './components/Admin/CandidateDetail';

function MainApp() {
  const location = useLocation();

  const hideHeaderRoutes = ['/admin/login', '/admin/dashboard', '/admin/candidate/:id'];
  const isCandidateRoute = location.pathname.match(/^\/admin\/candidate\/[a-f0-9]{24}$/i);

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && !isCandidateRoute && <CandidateHeader />}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ToastContainer />
        <Routes>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminRoute role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/candidate/:id" element={<CandidateDetails />} />
          </Route>

          <Route path="/candidate/login" element={<CandidateLogin />} />
          <Route element={<PrivateRoute role="candidate" />}>
            <Route path="/candidate/home" element={<Home />} />
            <Route path="/candidate/profile" element={<CandidateProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/candidate/login" />} />
        </Routes>
      </div>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

