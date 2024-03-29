import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeacherDashboardPage from './pages/TeacherPage/DashboardPage';
import StudentDashboardPage from './pages/StudentPage/DashboardPage';
import AdminDashboardPage from './pages/AdminPage/DashboardPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
          <Route index element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

          {/* Teacher */}
          <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />

          {/* Student */}
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
    
          <Route path="*" element={<ErrorPage />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App;
