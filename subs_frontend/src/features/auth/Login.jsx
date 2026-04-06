import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./authService";
import {
  Sparkles,
  LogIn,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";

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
    <div className="min-h-screen flex bg-white">
      {/* Left Side: Branding + Value (same style as Register) */}
      <div className="hidden lg:flex w-1/3 bg-slate-900 p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="font-bold">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight">SubTrack</span>
          </div>

          <h2 className="text-3xl font-bold mb-8">
            Welcome back. Keep your recurring revenue under control.
          </h2>

          <div className="space-y-6">
            <FeatureItem
              icon={<Zap className="text-amber-400" size={20} />}
              title="Real-Time Insights"
              desc="Track billing health, MRR, and subscription trends instantly."
            />
            <FeatureItem
              icon={<CheckCircle2 className="text-emerald-400" size={20} />}
              title="Reliable Billing Flows"
              desc="Checkout, upgrades, and cancellations synced via Stripe webhooks."
            />
            <FeatureItem
              icon={<ShieldCheck className="text-indigo-400" size={20} />}
              title="Secure by Design"
              desc="JWT-protected APIs and verified webhook signatures for trust."
            />
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <p className="text-sm text-slate-300 italic">
            "SubTrack made our billing workflows clear, fast, and reliable."
          </p>
          <p className="text-sm font-bold mt-3 text-white">— Alex Rivera, Founder at Recurrly</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-8 bg-slate-50/50">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-4">
              <Sparkles size={12} />
              ACCESS YOUR BILLING DASHBOARD
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Login</h1>
            <p className="text-slate-500">Welcome back. Continue managing plans and subscriptions.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="john@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    className="text-xs text-indigo-600 hover:underline"
                    onClick={() => alert("Forgot password flow can be added in next step.")}
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="Your password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
            >
              {loading ? "Signing In..." : "Sign In"}
              <LogIn size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          </form>

          {/* Navigation to Register */}
          <div className="mt-8 text-center">
            <p className="text-slate-500">
              New to SubTrack?{" "}
              <Link to="/register" className="text-indigo-600 font-bold hover:underline decoration-2 underline-offset-4 inline-flex items-center gap-1">
                Create account
                <ArrowRight size={14} />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex gap-4">
    <div className="mt-1">{icon}</div>
    <div>
      <h4 className="font-bold text-white">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Login;