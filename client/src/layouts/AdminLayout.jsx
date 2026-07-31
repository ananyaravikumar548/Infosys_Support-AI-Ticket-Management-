import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopHeaderBar from '../components/layout/TopHeaderBar';
import { FiGrid, FiUsers, FiUserCheck, FiFolder, FiBarChart2, FiSettings, FiShield } from 'react-icons/fi';

const adminNav = [
  { label: 'Overview', path: '/admin/dashboard', icon: FiGrid },
  { label: 'Users', path: '/admin/users', icon: FiUsers },
  { label: 'Agents', path: '/admin/agents', icon: FiUserCheck },
  { label: 'Categories', path: '/admin/categories', icon: FiFolder },
  { label: 'Reports', path: '/admin/reports', icon: FiBarChart2 },
  { label: 'Settings', path: '/admin/settings', icon: FiSettings },
  { label: 'Audit Logs', path: '/admin/audit-logs', icon: FiShield },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar items={adminNav} theme="blue" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeaderBar title="ADMIN DASHBOARD" subtitle="System Overview • Analytics • User Management" theme="blue" />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
