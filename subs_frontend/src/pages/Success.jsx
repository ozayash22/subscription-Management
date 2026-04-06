import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LayoutDashboard,
  ReceiptText,
} from "lucide-react";

const Success = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dcfce7_0%,_#f8fafc_40%,_#ffffff_100%)] flex items-center justify-center px-5">
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-emerald-100 shadow-xl p-7 md:p-10">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="text-emerald-600" size={28} />
        </div>

        <h1 className="mt-5 text-3xl font-black text-slate-900">Payment Successful</h1>
        <p className="mt-2 text-slate-600">
          Your subscription checkout has been completed. Webhooks will sync your latest
          plan and billing state automatically.
        </p>

        <div className="mt-6 p-4 rounded-2xl border border-slate-200 bg-slate-50">
          <p className="text-sm text-slate-700 flex items-start gap-2">
            <ReceiptText size={16} className="mt-0.5 text-slate-500" />
            <span>
              Stripe session:
              <span className="font-mono text-xs ml-1 text-slate-500">
                {sessionId || "not available"}
              </span>
            </span>
          </p>
        </div>

        <div className="mt-7 grid sm:grid-cols-3 gap-3">
          <Link
            to="/plans"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 font-semibold hover:bg-slate-800 transition"
          >
            <CreditCard size={16} />
            Plans
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
            Home
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;