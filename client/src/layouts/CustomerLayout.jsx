import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopHeaderBar from '../components/layout/TopHeaderBar';
import { FiGrid, FiCheckSquare, FiPlusSquare, FiBell, FiUser, FiSettings } from 'react-icons/fi';

const customerNav = [
  { label: 'Dashboard', path: '/customer/dashboard', icon: FiGrid },
  { label: 'My Tickets', path: '/customer/tickets', icon: FiCheckSquare },
  { label: 'Create Ticket', path: '/customer/create-ticket', icon: FiPlusSquare },
  { label: 'Notifications', path: '/customer/notifications', icon: FiBell, badge: '3' },
  { label: 'Profile', path: '/customer/profile', icon: FiUser },
  { label: 'Settings', path: '/customer/settings', icon: FiSettings },
];

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar items={customerNav} theme="purple" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeaderBar title="CUSTOMER PORTAL" subtitle="Raise Tickets • Track Status • Get Resolutions" theme="purple" />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}