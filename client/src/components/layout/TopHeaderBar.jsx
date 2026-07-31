import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FiBell, FiSearch } from 'react-icons/fi';

export default function TopHeaderBar({ title, subtitle, theme = 'purple' }) {
  const { user } = useContext(AuthContext);

  const isBlueTheme = theme === 'blue';

  return (
    <header className={`${isBlueTheme ? 'bg-blue-700' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white px-8 py-4 shadow-md flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg border border-white/30">
          🛡️
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wide leading-tight">{title}</h1>
          <p className="text-xs text-blue-100/80 font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Optional Search bar in Header */}
        <div className="relative hidden md:block">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search tickets..."
            className="pl-9 pr-4 py-1.5 text-xs rounded-full bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56 shadow-inner"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <FiBell className="w-4 h-4 text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/20">
          <img 
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
            alt={user?.name}
            className="w-8 h-8 rounded-full border border-white/40 object-cover" 
          />
        </div>
      </div>
    </header>
  );
}
