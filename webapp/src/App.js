import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import RegisterPage from './pages/RegisterPage';
import TeacherDashboard from './pages/TeacherPage/Dashboard/TeacherDashboard';
import StudentDashboardPage from './pages/StudentPage/DashboardPage';
import AdminDashboardPage from './pages/AdminPage/Dashboard/DashboardPage';
import TeacherManagementPage from './pages/AdminPage/Teacher/TeacherManagementPage';
import StudentManagementPage from './pages/AdminPage/Student/StudentManagementPage';
import ClassManagementPage from './pages/AdminPage/Class/ClassManagementPage';
import CourseManagementPage from './pages/AdminPage/Course/CourseManagementPage';
import ClassDetailPage from './pages/AdminPage/StudentClass/ClassDetailPage';
import ReportAttendancePage from './pages/AdminPage/Report/ReportAttendancePage';
import ReportClassPage from './pages/AdminPage/Report/ReportClassPage';
import ReportAttendanceDetail from './pages/AdminPage/Report/ReportAttendanceDetail';
import StudentTeacherManagement from './pages/TeacherPage/Student/StudentTeacherManagement';
import CourseTeacherManagement from './pages/TeacherPage/Course/CourseTeacherManagement';
import ClassTeacherManagement from './pages/TeacherPage/Class/ClassTeacherManagement';
import ScheduleTeacherManagement from './pages/TeacherPage/Schedule/ScheduleTeacherManagement';

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
          path="/admin/reports"
          element={
            <PrivateRoute>
              <ReportAttendancePage />
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
        <Route
          path="admin/reports/:courseId/classes"
          element={
            <PrivateRoute>
              <ReportClassPage />
            </PrivateRoute>
          }
        />

        <Route
          path="admin/reports/:courseId/classes/:classId/attendance"
          element={
            <PrivateRoute>
              <ReportAttendanceDetail />
            </PrivateRoute>
          }
        />

        {/* Teacher */}
        <Route
          path="/teacher/dashboard"
          element={
            <PrivateRoute>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/students"
          element={
            <PrivateRoute>
              <StudentTeacherManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/courses"
          element={
            <PrivateRoute>
              <CourseTeacherManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/classes"
          element={
            <PrivateRoute>
              <ClassTeacherManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/schedule"
          element={
            <PrivateRoute>
              <ScheduleTeacherManagement />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
