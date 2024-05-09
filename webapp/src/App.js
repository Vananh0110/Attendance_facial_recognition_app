import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
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
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <PrivateRoute>
              <TeacherManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <PrivateRoute>
              <StudentManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <PrivateRoute>
              <CourseManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/classes"
          element={
            <PrivateRoute>
              <ClassManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="admin/classes/classDetail/:classId"
          element={
            <PrivateRoute>
              <ClassDetailPage />
            </PrivateRoute>
          }
        />

        {/* Teacher */}
        <Route
          path="/teacher/dashboard"
          element={
            <PrivateRoute>
              <TeacherDashboardPage />
            </PrivateRoute>
          }
        />

        {/* Student */}
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute>
              <StudentDashboardPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<ErrorPage />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
