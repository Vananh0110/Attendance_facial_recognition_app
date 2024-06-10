import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import RegisterPage from './pages/RegisterPage';
import TeacherDashboard from './pages/TeacherPage/Dashboard/TeacherDashboard';
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
import TeacherClassDetail from './pages/TeacherPage/StudentClass.js/TeacherClassDetail';
import TeacherAttendancePage from './pages/TeacherPage/Attendance/TeacherAttendancePage';
import TeacherAttendanceClassDetail from './pages/TeacherPage/Attendance/TeacherAttendanceClassDetail';
import TraditionalAttendance from './pages/TeacherPage/Attendance/TraditionalAttendance';
import QrCodeAttendance from './pages/TeacherPage/Attendance/QrCodeAttendance';
import TeacherReportPage from './pages/TeacherPage/Report/TeacherReportPage';
import TeacherReportClassDetail from './pages/TeacherPage/Report/TeacherReportClassDetail';
import TeacherProfile from './pages/TeacherPage/Profile/TeacherProfile';
import StudentDashboardPage from './pages/StudentPage/Dashboard/StudentDashboardPage';
import StudentSchedulePage from './pages/StudentPage/Schedule/StudentSchedulePage';
import StudentClassPage from './pages/StudentPage/Class/StudentClassPage';
import StudentReportPage from './pages/StudentPage/Report/StudentReportPage';
import StudentClassDetail from './pages/StudentPage/Class/StudentClassDetail';
import StudentReportClassDetail from './pages/StudentPage/Report/StudentReportClassDetail';
import StudentProfile from './pages/StudentPage/Profile/StudentProfile';
import AdminProfile from './pages/AdminPage/Profile/AdminProfile';

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
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <TeacherManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <StudentManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <CourseManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/classes"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ClassManagementPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ReportAttendancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="admin/classes/classDetail/:classId"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ClassDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="admin/reports/:courseId/classes"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ReportClassPage />
            </PrivateRoute>
          }
        />

        <Route
          path="admin/reports/:courseId/classes/:classId/attendance"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ReportAttendanceDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminProfile />
            </PrivateRoute>
          }
        />

        {/* Teacher */}
        <Route
          path="/teacher/dashboard"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/students"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <StudentTeacherManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/courses"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <CourseTeacherManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/classes"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <ClassTeacherManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/classes/classDetail/:classId"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <TeacherClassDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/schedule"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <ScheduleTeacherManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <TeacherAttendancePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/attendance/classDetail/:classId"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <TeacherAttendanceClassDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/attendance/classDetail/:classId/traditional"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <TraditionalAttendance />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/attendance/classDetail/:classId/qrcode"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <QrCodeAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/report"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <TeacherReportPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/report/classDetail/:classId"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <TeacherReportClassDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/profile"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <TeacherProfile />
            </PrivateRoute>
          }
        />

        {/* Student */}
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/schedule"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentSchedulePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/classes"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentClassPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/classes/classDetail/:classId"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentClassDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/report"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentReportPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/report/classDetail/:classId"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentReportClassDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentProfile />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
