import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CreditCard,
  LogOut,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../features/auth/authService";

const Landing = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fef3c7_0%,_#f8fafc_38%,_#ffffff_100%)] text-slate-900">
      <nav className="sticky top-0 z-50 backdrop-blur bg-white/85 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              S
            </div>
            <div>
              <p className="text-sm font-black tracking-tight">SubTrack</p>
              <p className="text-[11px] text-slate-500 -mt-0.5">Subscription Intelligence</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition">Features</a>
            <a href="#value" className="hover:text-slate-900 transition">Value</a>
            <a href="#cta" className="hover:text-slate-900 transition">Get Started</a>
          </div>

          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                Create Account
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                <ArrowRight size={14} />
              </Link>
              <button
                onClick={logoutUser}
                className="inline-flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <section className="px-5 md:px-8 pt-16 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-6">
              <Sparkles size={13} />
              BUILD A REAL SAAS BILLING ENGINE
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-[1.04] tracking-tight">
              Subscription Billing
              <span className="block text-indigo-600">That Stays In Sync</span>
            </h1>

            <p className="mt-6 text-slate-600 text-lg leading-relaxed max-w-xl">
              Run recurring revenue workflows with confidence. SubTrack connects your app, billing events,
              and analytics in one clean operational flow.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition"
                  >
                    Start Free
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-100 px-6 py-3 rounded-xl font-semibold transition"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to="/plans"
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Manage Plans & Billing
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                Stripe Checkout
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                Webhook State Sync
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                MRR + Churn Insights
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-6 md:p-8">
              <h3 className="font-bold text-slate-900 text-lg">Live Snapshot</h3>
              <p className="text-sm text-slate-500 mt-1">What your platform tracks in real-time</p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Metric title="MRR" value="$12,480" tone="bg-emerald-50 text-emerald-700" />
                <Metric title="Subscribers" value="312" tone="bg-indigo-50 text-indigo-700" />
                <Metric title="Churn" value="2.6%" tone="bg-amber-50 text-amber-700" />
                <Metric title="Revenue" value="$88,120" tone="bg-slate-100 text-slate-700" />
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-sm text-slate-600">
                  Events like <span className="font-semibold">checkout.session.completed</span> and
                  <span className="font-semibold"> invoice.paid</span> are verified and synced into MongoDB.
                </p>
              </div>
            </div>

            <div className="hidden md:block absolute -z-10 -right-6 -bottom-6 w-40 h-40 rounded-full bg-indigo-200/40 blur-2xl" />
          </div>
        </div>
      </section>

      <section id="features" className="px-5 md:px-8 pb-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-5">
          <FeatureCard
            icon={<CreditCard className="text-indigo-600" size={20} />}
            title="Stripe-First Billing"
            desc="Create plans, start subscriptions, switch plans, and schedule cancellation with real Stripe flows."
          />
          <FeatureCard
            icon={<ShieldCheck className="text-emerald-600" size={20} />}
            title="Reliable State Management"
            desc="Webhook signature verification and idempotent writes keep your billing data consistent."
          />
          <FeatureCard
            icon={<BarChart3 className="text-amber-600" size={20} />}
            title="Business Visibility"
            desc="Track subscribers, MRR, churn, and total revenue from a role-aware dashboard."
          />
        </div>
      </section>

      <section id="value" className="px-5 md:px-8 pb-20">
        <div className="max-w-7xl mx-auto rounded-3xl bg-slate-900 text-white p-8 md:p-12">
          <p className="text-xs uppercase tracking-widest text-slate-300">Why This Matters</p>
          <h2 className="text-3xl md:text-4xl font-black mt-3">From Demo to Production Thinking</h2>
          <p className="mt-4 text-slate-300 max-w-3xl">
            This project is built to show practical engineering: auth boundaries, payment lifecycle handling,
            webhook resiliency, and measurable business outcomes.
          </p>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <Pill icon={<Zap size={15} />} text="Role-based UX" />
            <Pill icon={<ShieldCheck size={15} />} text="Idempotent webhooks" />
            <Pill icon={<BarChart3 size={15} />} text="Analytics driven" />
          </div>
        </div>
      </section>

      <section id="cta" className="px-5 md:px-8 pb-20">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900">Ready to explore the flow?</h3>
          <p className="text-slate-600 mt-2">
            {isAuthenticated
              ? "Jump into your dashboard and continue managing billing."
              : "Create an account and run through the full subscription lifecycle."}
          </p>
          <div className="mt-6">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
              >
                Open Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
              >
                Create Account
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const Metric = ({ title, value, tone }) => (
  <div className="p-4 rounded-2xl border border-slate-200">
    <p className="text-xs text-slate-500 uppercase tracking-wide">{title}</p>
    <p className={`mt-2 inline-block px-2 py-1 rounded-lg text-xl font-black ${tone}`}>{value}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">{icon}</div>
    <h4 className="mt-4 text-lg font-bold text-slate-900">{title}</h4>
    <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
  </div>
);

const Pill = ({ icon, text }) => (
  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-sm">
    {icon}
    {text}
  </div>
);

export default Landing;