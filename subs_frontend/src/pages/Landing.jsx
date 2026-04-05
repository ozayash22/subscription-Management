import { Link } from "react-router-dom";
import { CheckCircle, BarChart3, ShieldCheck, Zap } from "lucide-react"; // Optional: Install lucide-react for icons

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            SubTrack
          </h1>
        </div>

        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition">Features</a>
          <a href="#pricing" className="hover:text-indigo-600 transition">Pricing</a>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-indigo-600">
            Sign in
          </Link>
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition shadow-md shadow-indigo-200"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            Now in Beta • version 2.0
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mt-6 mb-6 tracking-tight">
            Manage Subscriptions <br />
            <span className="text-indigo-600">Without the Headache.</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop losing revenue to churn and expired cards. SubTrack automates your 
            entire billing lifecycle so you can focus on building your product.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105"
            >
              Start 14-Day Free Trial
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition">
              View Demo
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2"><CheckCircle size={16}/> No credit card required</div>
            <div className="flex items-center gap-2"><CheckCircle size={16}/> Cancel anytime</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need to scale</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<BarChart3 className="text-indigo-600" />}
              title="Advanced Analytics"
              desc="Track MRR, LTV, and Churn rates in real-time with beautiful automated reports."
            />
            <FeatureCard 
              icon={<Zap className="text-amber-500" />}
              title="Automated Billing"
              desc="Generate invoices and handle recurring payments globally with tax compliance."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-emerald-500" />}
              title="Secure Handling"
              desc="Bank-grade security for customer data and PCI-compliant payment processing."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition group">
    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;