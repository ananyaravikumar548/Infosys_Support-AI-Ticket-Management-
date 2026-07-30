import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { mockUsers } from '../../mock/users';
import { toast } from 'react-toastify';
import { FiLock, FiMail, FiShield } from 'react-icons/fi';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
    
    if (user) {
      login(user);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'customer') navigate('/customer/dashboard');
      else if (user.role === 'agent') navigate('/agent/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    } else {
      toast.error('Invalid credentials!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-xl bg-indigo-50 text-indigo-600 mb-2">
            <FiShield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Support AI</h2>
          <p className="text-sm text-slate-500">Ticket Management</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-slate-400" />
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Enter your email"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-slate-400" />
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                placeholder="Enter your password"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors shadow-md shadow-indigo-200"
          >
            Sign In
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}