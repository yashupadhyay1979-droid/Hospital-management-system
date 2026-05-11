import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  Users,
  LayoutDashboard,
  Settings,
  FileText,
  ActivitySquare,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', color: '#6366f1' },
  { icon: Users, label: 'Patients', path: '/patients', color: '#3b82f6' },
  { icon: FileText, label: 'EMR', path: '/emr', color: '#ec4899' },
  { icon: Activity, label: 'Lab', path: '/lab', color: '#f59e0b' },
  { icon: ActivitySquare, label: 'HL7 Monitor', path: '/hl7', color: '#10b981' },
  { icon: Settings, label: 'Settings', path: '/settings', color: '#8b5cf6' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Activity size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="sidebar-brand">ASPATAL</h1>
          <p className="sidebar-brand-sub">HMS v2.0</p>
        </div>
      </div>

      <div className="sidebar-section-label">Navigation</div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              style={isActive ? { '--item-color': item.color } : {}}
            >
              <span
                className="sidebar-nav-icon"
                style={{ color: isActive ? item.color : undefined }}
              >
                <item.icon size={19} />
              </span>
              <span className="sidebar-nav-label">{item.label}</span>
              {isActive && <ChevronRight size={14} className="sidebar-nav-chevron" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-spacer" />

      {/* User card */}
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">{user?.avatar || 'AD'}</div>
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">{user?.name || 'Admin User'}</p>
          <p className="sidebar-user-role">{user?.role || 'Administrator'}</p>
        </div>
        <button
          onClick={logout}
          className="sidebar-logout-btn"
          title="Sign out"
        >
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
}
