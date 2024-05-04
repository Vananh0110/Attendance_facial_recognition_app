import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import {
  ChevronDown,
  AlignJustify,
  LayoutDashboard,
  Folder,
  Users,
  GraduationCap,
  Building,
} from 'lucide-react';
import '../../App.css';

const getRoleName = (roleId) => {
  switch (roleId) {
    case 1:
      return 'Admin';
    case 2:
      return 'Teacher';
    case 3:
      return 'Student';
    default:
      return 'Unknown Role';
  }
};

const Layout = ({ children }) => {
  const [userData, setUserData] = useState(null);
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
                <a className="dropdown-item" href="#">
                  Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
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
                to="/admin/dashboard"
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
                to="/admin/teachers"
                activeClassName="active"
                className="sidebar-link"
              >
                <GraduationCap
                  className="icon"
                  data-tooltip-id="teachers-tooltip"
                />
                <span>Teachers</span>
              </NavLink>
              <ReactTooltip
                id="teachers-tooltip"
                place="right"
                content="Teachers"
              />
            </li>
            <li className="sidebar-item">
              <NavLink
                to="/admin/students"
                activeClassName="active"
                className="sidebar-link"
              >
                <Users className="icon" data-tooltip-id="students-tooltip" />
                <span>Students</span>
              </NavLink>
              <ReactTooltip
                id="students-tooltip"
                place="right"
                content="Students"
              />
            </li>
            <li className="sidebar-item">
              <NavLink
                to="/admin/classes"
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
                to="/admin/reports"
                activeClassName="active"
                className="sidebar-link"
              >
                <Folder className="icon" data-tooltip-id="reports-tooltip" />
                <span>Report</span>
              </NavLink>
              <ReactTooltip
                id="reports-tooltip"
                place="right"
                content="Report"
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
