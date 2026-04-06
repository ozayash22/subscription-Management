import { Link } from "react-router-dom";
import { ArrowRight, CreditCard, LayoutDashboard, RotateCcw, XCircle } from "lucide-react";

const Cancel = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#ffe4e6_0%,_#f8fafc_40%,_#ffffff_100%)] flex items-center justify-center px-5">
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-rose-100 shadow-xl p-7 md:p-10">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center">
          <XCircle className="text-rose-600" size={28} />
        </div>

        <h1 className="mt-5 text-3xl font-black text-slate-900">Payment Canceled</h1>
        <p className="mt-2 text-slate-600">
          No charge was completed. You can go back to plans and retry checkout anytime.
        </p>

        <div className="mt-6 p-4 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 text-sm">
          Tip: if checkout closes unexpectedly, retry from the Plans page and complete payment in the same browser tab.
        </div>

        <div className="mt-7 grid sm:grid-cols-3 gap-3">
          <Link
            to="/plans"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 font-semibold hover:bg-slate-800 transition"
          >
            <RotateCcw size={16} />
            Retry Checkout
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 text-slate-700 px-4 py-3 font-semibold hover:bg-slate-50 transition"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 text-slate-700 px-4 py-3 font-semibold hover:bg-slate-50 transition"
          >
            <CreditCard size={16} />
            Home
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cancel;