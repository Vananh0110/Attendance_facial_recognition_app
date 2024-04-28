import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  AlignJustify,
  LayoutDashboard,
  Folder,
  Users,
  GraduationCap,
  Building,
} from 'lucide-react';
import '../App.css';

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
              <a href="#" className="sidebar-link" data-bs-toggle="tooltip" title="Dashboard">
                <LayoutDashboard className="icon" />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="sidebar-item" data-bs-toggle="tooltip" title="Teachers">
              <a href="#" className="sidebar-link">
                <GraduationCap className="icon" />
                <span>Teachers</span>
              </a>
            </li>
            <li className="sidebar-item" data-bs-toggle="tooltip" title="Students">
              <a href="#" className="sidebar-link">
                <Users className="icon" />
                <span>Students</span>
              </a>
            </li>
            <li className="sidebar-item" data-bs-toggle="tooltip" title="Classes">
              <a href="#" className="sidebar-link">
                <Building className="icon" />
                <span>Classes</span>
              </a>
            </li>
            <li className="sidebar-item" data-bs-toggle="tooltip" title="Report">
              <a href="#" className="sidebar-link">
                <Folder className="icon" />
                <span>Report</span>
              </a>
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
