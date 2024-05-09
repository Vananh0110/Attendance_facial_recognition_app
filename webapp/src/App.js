import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeacherDashboardPage from './pages/TeacherPage/DashboardPage';
import StudentDashboardPage from './pages/StudentPage/DashboardPage';
import AdminDashboardPage from './pages/AdminPage/Dashboard/DashboardPage';
import TeacherManagementPage from './pages/AdminPage/Teacher/TeacherManagementPage';
import StudentManagementPage from './pages/AdminPage/Student/StudentManagementPage';
import ClassManagementPage from './pages/AdminPage/Class/ClassManagementPage';
import CourseManagementPage from './pages/AdminPage/Course/CourseManagementPage';
import ClassDetailPage from './pages/AdminPage/StudentClass/ClassDetailPage';

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
          <Route path="/admin/teachers" element={<TeacherManagementPage/>}/>
          <Route path="/admin/students" element={<StudentManagementPage/>}/>
          <Route path="/admin/courses" element={<CourseManagementPage/>}/>
          <Route path="/admin/classes" element={<ClassManagementPage/>}/>
          <Route path="admin/classes/classDetail/:classId" element={<ClassDetailPage/>} />

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
