import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/patients': 'Patients',
  '/emr': 'Electronic Medical Records',
  '/lab': 'Laboratory',
  '/hl7': 'HL7 Monitor',
  '/settings': 'Settings',
};

export default function Layout() {
  const location = useLocation();
  const { user } = useAuth();
  const title = PAGE_TITLES[location.pathname] || 'Dashboard';

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <h2 className="topbar-title">{title}</h2>
          </div>
          <div className="topbar-right">
            <div className="topbar-search">
              <Search size={15} className="topbar-search-icon" />
              <input
                type="text"
                placeholder="Search patients, records..."
                className="topbar-search-input"
              />
            </div>
            <button className="topbar-notif-btn">
              <Bell size={19} />
              <span className="topbar-notif-dot" />
            </button>
            <div className="topbar-user-avatar">{user?.avatar || 'AD'}</div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
