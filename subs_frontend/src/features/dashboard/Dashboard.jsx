import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/client";
import { logoutUser } from "../auth/authService"; // Adjust path as needed
import { LogOut, Users, DollarSign, TrendingUp, Bell } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    API.get("/analytics")
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Session expired or error", err);
        // If 401 Unauthorized, kick them out
        if (err.response?.status === 401) logoutUser();
      });
  }, []);

  const handleLogout = () => {
    // Optional: You can call a backend /logout endpoint here if needed
    logoutUser();
  };

  if (!data) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <h1 className="text-lg font-bold text-slate-800">Dashboard</h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-600 transition">
              <Bell size={20} />
            </button>
            
            <div className="h-8 w-[1px] bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user.name || "User"}</p>
                <p className="text-xs text-slate-500 mt-1">{user.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm group"
              >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Revenue Overview</h2>
            <p className="text-slate-500 text-sm">Welcome back! Here is what's happening today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Total Subscribers" 
              value={data.totalSubscribers} 
              icon={<Users className="text-indigo-600" />} 
              color="bg-indigo-50"
            />
            <StatCard 
              title="Monthly Recurring Revenue" 
              value={`$${data.mrr?.toLocaleString()}`} 
              icon={<TrendingUp className="text-emerald-600" />} 
              color="bg-emerald-50"
            />
            <StatCard 
              title="Total Revenue" 
              value={`$${data.totalRevenue?.toLocaleString()}`} 
              icon={<DollarSign className="text-amber-600" />} 
              color="bg-amber-50"
            />
          </div>

          {/* Placeholder for a Chart/Table */}
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl h-64 flex items-center justify-center text-slate-400 italic">
            Chart Visualization Area (Integration Coming Soon)
          </div>
        </main>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">+12%</span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

export default Dashboard;