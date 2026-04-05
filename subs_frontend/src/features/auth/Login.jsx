import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./authService";
import { LogIn, ArrowRight } from "lucide-react"; // npm install lucide-react

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-700 opacity-90" />
        <div className="relative z-10 text-white max-w-md">
          <h2 className="text-4xl font-bold mb-6">Welcome back to SubTrack.</h2>
          <p className="text-indigo-100 text-lg">
            Stop chasing spreadsheets. Start scaling your recurring revenue with 
            real-time insights.
          </p>
        </div>
        {/* Decorative Circles */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Login</h1>
            <p className="text-slate-500">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="name@company.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs text-indigo-600 hover:underline">Forgot?</a>
              </div>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? "Signing in..." : "Sign In"}
              <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Unique Navigation to Register */}
          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-600 mb-4">New to SubTrack?</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition group"
            >
              Create a free account 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;