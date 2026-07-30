import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FiUser, FiMail, FiShield } from 'react-icons/fi';

export default function CustomerProfile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
      <h2 className="text-lg font-bold text-slate-800 mb-6">My Profile</h2>
      <div className="flex items-center gap-6 mb-8 pb-6 border-b border-slate-100">
        <img src={user?.avatar} alt={user?.name} className="w-20 h-20 rounded-full border-2 border-indigo-500 object-cover" />
        <div>
          <h3 className="text-xl font-bold text-slate-800">{user?.name}</h3>
          <p className="text-xs text-slate-500 capitalize">{user?.role} Account</p>
          <span className="inline-block mt-2 px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 rounded-full">
            Active Status
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 border border-slate-200">
            <FiUser className="text-slate-400" /> {user?.name}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 border border-slate-200">
            <FiMail className="text-slate-400" /> {user?.email}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Role Permission</label>
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 border border-slate-200">
            <FiShield className="text-slate-400" /> {user?.role}
          </div>
        </div>
      </div>
    </div>
  );
}