import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import {
  ChevronDown,
  AlignJustify,
  LayoutDashboard,
  UserCheck,
  Users,
  Building,
  NotepadText,
  CalendarCheck,
  ClipboardList,
} from 'lucide-react';
import '../../App.css';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

const getRoleName = (roleId) => {
  switch (roleId) {
    case 1:
      return 'teacher';
    case 2:
      return 'Teacher';
    case 3:
      return 'Student';
    default:
      return 'Unknown Role';
  }
};
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Layout = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    setUserData(userData);
  }, []);

  useEffect(() => {
    const expandButton = document.querySelector('.toggle-btn');

    const toggleSidebar = () => {
      document.querySelector('#sidebar').classList.toggle('expand');
    };

    expandButton.addEventListener('click', toggleSidebar);

    return () => {
      expandButton.removeEventListener('click', toggleSidebar);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar fixed-top">
        <div className="d-flex">
          <button className="toggle-btn" type="button">
            <AlignJustify className="icon" />
          </button>
          <div className="sidebar-logo">
            <a href="#">Attendance</a>
          </div>
        </div>
        <div className="d-flex">
          <div className="d-flex align-items-center">
            <Avatar
              src={userData?.avatar_url ? `${BASE_URL}${userData.avatar_url}` : undefined}
              icon={!userData?.avatar_url && <UserOutlined />}
              style={{ marginRight: 8 }}
            />
          </div>
          <div className="d-flex flex-column">
            <div className="username">{userData?.username}</div>
            <div className="role">{getRoleName(userData?.role_id)}</div>
          </div>
          <div className="dropdown pt-3 ms-2">
            <a
              className="nav-link"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              <ChevronDown />
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a className="dropdown-item" href="/student/profile">
                  Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item" onClick={handleLogout}>
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="wrapper">
        <aside id="sidebar">
          <ul className="sidebar-nav">
            <li className="sidebar-item">
              <NavLink
                to="/student/dashboard"
                activeClassName="active"
                className="sidebar-link"
              >
                <LayoutDashboard
                  className="icon"
                  data-tooltip-id="dashboard-tooltip"
                />
                <span>Dashboard</span>
              </NavLink>
              <ReactTooltip
                id="dashboard-tooltip"
                place="right"
                content="Dashboard"
              />
            </li>
            <li className="sidebar-item">
              <NavLink
                to="/student/schedule"
                activeClassName="active"
                className="sidebar-link"
              >
                <CalendarCheck
                  className="icon"
                  data-tooltip-id="schedule-tooltip"
                />
                <span>Schedule</span>
              </NavLink>
              <ReactTooltip
                id="schedule-tooltip"
                place="right"
                content="Schedule"
              />
            </li>
            <li className="sidebar-item">
              <NavLink
                to="/student/classes"
                activeClassName="active"
                className="sidebar-link"
              >
                <Building className="icon" data-tooltip-id="classes-tooltip" />
                <span>Classes</span>
              </NavLink>
              <ReactTooltip
                id="classes-tooltip"
                place="right"
                content="Classes"
              />
            </li>
            <li className="sidebar-item">
              <NavLink
                to="/student/report"
                activeClassName="active"
                className="sidebar-link"
              >
                <ClipboardList
                  className="icon"
                  data-tooltip-id="report-tooltip"
                />
                <span>Reports</span>
              </NavLink>
              <ReactTooltip
                id="report-tooltip"
                place="right"
                content="Reports"
              />
            </li>
          </ul>
        </aside>
        <div className="main p-3 pt-5">
          <div className="pt-5">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
