import { useEffect, useState } from "react";
import { getPlans, createPlan, subscribePlan } from "./planService";
import { useAuth } from "../../hooks/useAuth";

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const { isAdmin } = useAuth();

  const fetchPlans = async () => {
    const res = await getPlans();
    setPlans(res.data);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreate = async () => {
    await createPlan({
      name: "Pro",
      price: 20,
      billingCycle: "monthly",
    });
    fetchPlans();
  };

  const handleSubscribe = async (id) => {
    const res = await subscribePlan(id);
    window.location.href = res.data.url;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Plans</h1>

      {isAdmin && (
        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2 mt-4"
        >
          Create Plan
        </button>
      )}

      <div className="grid grid-cols-3 gap-4 mt-6">
        {plans.map((plan) => (
          <div key={plan._id} className="border p-4">
            <h2 className="text-xl">{plan.name}</h2>
            <p>${plan.price}</p>

            {!isAdmin && (
              <button
                onClick={() => handleSubscribe(plan._id)}
                className="mt-4 bg-black text-white px-4 py-2"
              >
                Subscribe
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansPage;