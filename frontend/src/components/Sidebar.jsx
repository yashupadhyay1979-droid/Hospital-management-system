import { Link, useLocation } from 'react-router-dom';
import { Activity, Users, LayoutDashboard, Settings, FileText, ActivitySquare } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Patients', path: '/patients' },
  { icon: FileText, label: 'EMR', path: '/emr' },
  { icon: Activity, label: 'Lab', path: '/lab' },
  { icon: ActivitySquare, label: 'HL7 Monitor', path: '/hl7' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-border h-screen flex flex-col shadow-sm">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-xl text-primary-foreground">
          <Activity size={24} />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
          Aspataal OS
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">
            AD
          </div>
          <div>
            <p className="font-medium text-sm">Admin User</p>
            <p className="text-xs text-muted-foreground">System Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
