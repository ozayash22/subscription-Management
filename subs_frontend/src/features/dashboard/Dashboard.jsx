import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/client";
import { logoutUser } from "../auth/authService";
import { useAuth } from "../../hooks/useAuth";
import {
  LogOut,
  Users,
  DollarSign,
  TrendingUp,
  Bell,
  CreditCard,
  Shield,
  ArrowRight,
  BarChart3,
} from "lucide-react";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const requests = [API.get("/analytics")];
        if (!isAdmin) requests.push(API.get("/subscriptions/me"));

        const [analyticsRes, subRes] = await Promise.all(requests);
        if (!active) return;

        setAnalytics(analyticsRes.data || null);
        setSubscription(isAdmin ? null : (subRes?.data?.subscription || null));
      } catch (err) {
        console.error("Dashboard load failed:", err);
        if (err.response?.status === 401) logoutUser();
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const greeting = useMemo(() => {
    if (!user?.name) return "Welcome";
    const first = user.name.split(" ")[0];
    return `Welcome, ${first}`;
  }, [user]);

  if (loading || !analytics) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            S
          </div>
          <h1 className="text-lg font-bold text-slate-800">Dashboard</h1>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              isAdmin
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            {isAdmin ? "Admin" : "Customer"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-slate-600 transition">
            <Bell size={20} />
          </button>

          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || "User"}</p>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
          </div>

          <button
            onClick={logoutUser}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">{greeting}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {isAdmin
              ? "Here is a business-level snapshot and quick admin controls."
              : "Here is your billing and subscription snapshot."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Subscribers"
            value={analytics.totalSubscribers ?? 0}
            icon={<Users className="text-indigo-600" />}
            color="bg-indigo-50"
          />
          <StatCard
            title="Monthly Recurring Revenue"
            value={`$${Number(analytics.mrr || 0).toLocaleString()}`}
            icon={<TrendingUp className="text-emerald-600" />}
            color="bg-emerald-50"
          />
          <StatCard
            title="Total Revenue"
            value={`$${Number(analytics.totalRevenue || 0).toLocaleString()}`}
            icon={<DollarSign className="text-amber-600" />}
            color="bg-amber-50"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {isAdmin ? (
            <AdminPanel churnRate={analytics.churnRate} />
          ) : (
            <CustomerPanel subscription={subscription} />
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 size={18} />
              Quick Actions
            </h3>

            <div className="mt-4 space-y-3">
              <Link
                to="/plans"
                className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
              >
                <span className="text-sm font-medium text-slate-700">Open Plans & Billing</span>
                <ArrowRight size={16} className="text-slate-500" />
              </Link>

              <Link
                to="/"
                className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
              >
                <span className="text-sm font-medium text-slate-700">Go to Landing Page</span>
                <ArrowRight size={16} className="text-slate-500" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const AdminPanel = ({ churnRate }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6">
    <h3 className="font-bold text-slate-900 flex items-center gap-2">
      <Shield size={18} />
      Admin Insights
    </h3>
    <p className="text-slate-600 text-sm mt-3">
      Churn Snapshot: <span className="font-semibold text-slate-900">{Number(churnRate || 0)}%</span>
    </p>
    <p className="text-slate-500 text-sm mt-2">
      As admin, you can create and manage plans from the Plans page.
    </p>
    <Link
      to="/plans"
      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg"
    >
      Manage Plans
      <ArrowRight size={14} />
    </Link>
  </div>
);

const CustomerPanel = ({ subscription }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6">
    <h3 className="font-bold text-slate-900 flex items-center gap-2">
      <CreditCard size={18} />
      My Subscription
    </h3>

    {!subscription ? (
      <>
        <p className="text-slate-600 text-sm mt-3">You do not have an active subscription yet.</p>
        <Link
          to="/plans"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Choose a Plan
          <ArrowRight size={14} />
        </Link>
      </>
    ) : (
      <div className="mt-3 text-sm text-slate-700 space-y-2">
        <p>
          Status:{" "}
          <span className="font-semibold">
            {subscription.cancelAtPeriodEnd
              ? "Active (Cancellation scheduled)"
              : subscription.status}
          </span>
        </p>

        {subscription.cancelAtPeriodEnd && subscription.currentPeriodEnd && (
          <p className="text-amber-700">
            Your subscription remains active until{" "}
            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
          </p>
        )}

        <p>
          Plan: <span className="font-semibold">{subscription.plan?.name || "N/A"}</span>
        </p>
        <p>
          Cancel at period end:{" "}
          <span className="font-semibold">{subscription.cancelAtPeriodEnd ? "Yes" : "No"}</span>
        </p>
        <p>
          Plan ends on:{" "}
          <span className="font-semibold">
            {subscription.currentPeriodEnd
              ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
              : "N/A"}
          </span>
        </p>

        <Link
          to="/plans"
          className="inline-flex items-center gap-2 mt-3 px-4 py-2 border border-indigo-200 text-indigo-700 bg-indigo-50 rounded-lg"
        >
          Manage Subscription
          <ArrowRight size={14} />
        </Link>
      </div>
    )}
  </div>
);

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">
        Live
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

export default Dashboard;