import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';

export default function Sidebar({ items, theme = 'purple' }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isBlueTheme = theme === 'blue';

  return (
    <aside className={`w-64 ${isBlueTheme ? 'bg-[#172554]' : 'bg-[#1E1B4B]'} text-white flex flex-col justify-between p-4 shadow-xl min-h-screen transition-all duration-300`}>
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
            Q
          </div>
          <div>
            <h2 className="font-bold text-base tracking-wide leading-none">Support AI</h2>
            <span className="text-[10px] text-slate-400">Ticket Management</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? isBlueTheme
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-red-500 text-white font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-9 h-9 rounded-full border border-white/20 object-cover"
          />
          <div className="max-w-[110px] truncate">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className={`text-[10px] flex items-center gap-1 ${isBlueTheme ? 'text-blue-400' : 'text-emerald-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isBlueTheme ? 'bg-blue-400' : 'bg-emerald-400'}`} /> {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <FiLogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
