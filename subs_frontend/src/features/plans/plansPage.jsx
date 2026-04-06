import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getPlans,
  createPlan,
  deletePlan,
  subscribePlan,
  getMySubscription,
  cancelMySubscription,
  changeMyPlan,
} from "./planService";
import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../auth/authService";
import {
  CreditCard,
  ArrowLeft,
  LogOut,
  Shield,
  CheckCircle2,
  Sparkles,
  Loader2,
  Trash2,
} from "lucide-react";

const initialPlanForm = {
  name: "",
  price: "",
  billingCycle: "monthly",
  featuresText: "",
};

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyPlanId, setBusyPlanId] = useState(null);
  const [deletingPlanId, setDeletingPlanId] = useState(null);
  const [globalActionLoading, setGlobalActionLoading] = useState(false);
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [planForm, setPlanForm] = useState(initialPlanForm);
  const { isAdmin, user } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const requests = [getPlans()];
      if (!isAdmin) requests.push(getMySubscription());

      const responses = await Promise.all(requests);
      setPlans(responses[0].data || []);

      if (!isAdmin) {
        setSubscription(responses[1].data?.subscription || null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  const currentPlanId = subscription?.plan?._id;

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => Number(a.price) - Number(b.price));
  }, [plans]);

  const handlePlanFormChange = (key, value) => {
    setPlanForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const name = planForm.name.trim();
    const price = Number(planForm.price);
    const billingCycle = planForm.billingCycle;
    const features = planForm.featuresText
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    if (!name) return alert("Plan name is required");
    if (!Number.isFinite(price) || price <= 0) return alert("Price must be greater than 0");

    try {
      setCreatingPlan(true);
      await createPlan({ name, price, billingCycle, features });
      setPlanForm(initialPlanForm);
      await fetchData();
      alert("Plan created successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Create plan failed");
    } finally {
      setCreatingPlan(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    const ok = window.confirm("Delete this plan? This cannot be undone.");
    if (!ok) return;

    try {
      setDeletingPlanId(planId);
      await deletePlan(planId);
      await fetchData();
      alert("Plan deleted");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeletingPlanId(null);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      setBusyPlanId(planId);
      const res = await subscribePlan(planId);
      window.location.href = res.data.url;
    } catch (err) {
      alert(err.response?.data?.message || "Subscribe failed");
      setBusyPlanId(null);
    }
  };

  const handleChangePlan = async (planId) => {
    try {
      setBusyPlanId(planId);
      await changeMyPlan(planId);
      await fetchData();
      alert("Plan changed successfully. Stripe applies proration automatically.");
    } catch (err) {
      alert(err.response?.data?.message || "Change plan failed");
    } finally {
      setBusyPlanId(null);
    }
  };

  const handleCancel = async () => {
    try {
      setGlobalActionLoading(true);
      await cancelMySubscription();
      await fetchData();
      alert("Subscription is scheduled to cancel at period end.");
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    } finally {
      setGlobalActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white/90 backdrop-blur border-b border-slate-200 px-6 md:px-10 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft size={16} />
              Back
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <h1 className="text-lg font-bold text-slate-900">Plans & Billing</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-sm text-slate-500">{user?.email || "Signed user"}</span>
            <button
              onClick={logoutUser}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 md:p-10 max-w-6xl mx-auto">
        {!isAdmin && (
          <section className="mb-6 p-5 rounded-2xl border bg-white shadow-sm">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <CreditCard size={18} />
              My Subscription
            </h2>

            {subscription ? (
              <div className="mt-3 text-sm text-slate-700 space-y-1">
                <p>
                  Status:{" "}
                  <span className="font-semibold">
                    {subscription.cancelAtPeriodEnd
                      ? "Active (Cancellation scheduled)"
                      : subscription.status}
                  </span>
                </p>
                <p>Plan: <span className="font-semibold">{subscription.plan?.name || "N/A"}</span></p>
                <p>Cancel at period end: <span className="font-semibold">{subscription.cancelAtPeriodEnd ? "Yes" : "No"}</span></p>
                <p>
                  Plan ends on:{" "}
                  <span className="font-semibold">
                    {subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "N/A"}
                  </span>
                </p>

                {subscription.cancelAtPeriodEnd && subscription.currentPeriodEnd && (
                  <p className="mt-2 text-amber-700 text-sm">
                    Your subscription remains active until {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                  </p>
                )}

                {!subscription.cancelAtPeriodEnd && (
                  <button
                    onClick={handleCancel}
                    disabled={globalActionLoading}
                    className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                  >
                    {globalActionLoading ? "Processing..." : "Cancel Subscription"}
                  </button>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-600">No subscription yet.</p>
            )}
          </section>
        )}

        {isAdmin && (
          <section className="mb-6 p-5 rounded-2xl border bg-white shadow-sm">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Shield size={18} />
              Create New Plan
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Add pricing plans with Stripe-backed recurring billing.
            </p>

            <form onSubmit={handleCreate} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Plan Name</label>
                <input
                  value={planForm.name}
                  onChange={(e) => handlePlanFormChange("name", e.target.value)}
                  placeholder="Starter"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">Price (USD)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={planForm.price}
                  onChange={(e) => handlePlanFormChange("price", e.target.value)}
                  placeholder="19"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">Billing Cycle</label>
                <select
                  value={planForm.billingCycle}
                  onChange={(e) => handlePlanFormChange("billingCycle", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">Features (comma separated)</label>
                <input
                  value={planForm.featuresText}
                  onChange={(e) => handlePlanFormChange("featuresText", e.target.value)}
                  placeholder="Team seats, API access, Priority support"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={creatingPlan}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                >
                  {creatingPlan ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {creatingPlan ? "Creating Plan..." : "Create Plan"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sortedPlans.map((plan) => {
            const isCurrent = currentPlanId && currentPlanId === plan._id;

            return (
              <div
                key={plan._id}
                className={`rounded-2xl border p-5 bg-white shadow-sm ${
                  isCurrent ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                      <CheckCircle2 size={12} />
                      Current
                    </span>
                  )}
                </div>

                <p className="text-slate-600 mt-1">${plan.price} / {plan.billingCycle}</p>

                {!!plan.features?.length && (
                  <ul className="mt-3 text-sm text-slate-600 space-y-1">
                    {plan.features.map((f) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                )}

                {isAdmin && (
                  <button
                    onClick={() => handleDeletePlan(plan._id)}
                    disabled={deletingPlanId === plan._id}
                    className="mt-4 inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                  >
                    <Trash2 size={14} />
                    {deletingPlanId === plan._id ? "Deleting..." : "Delete Plan"}
                  </button>
                )}

                {!isAdmin && (
                  <div className="mt-4">
                    {!subscription && (
                      <button
                        onClick={() => handleSubscribe(plan._id)}
                        disabled={busyPlanId === plan._id}
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                      >
                        {busyPlanId === plan._id ? "Redirecting..." : "Subscribe"}
                      </button>
                    )}

                    {!!subscription && isCurrent && (
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-default">
                        Current Plan
                      </button>
                    )}

                    {!!subscription && !isCurrent && (
                      <button
                        onClick={() => handleChangePlan(plan._id)}
                        disabled={busyPlanId === plan._id}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                      >
                        {busyPlanId === plan._id ? "Changing..." : "Switch to This Plan"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default PlansPage;