import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-secondary/30">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-slate-50/50">
        <div className="p-8 max-w-7xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
