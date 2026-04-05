import { useEffect, useState } from "react";
import API from "../../api/client";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/analytics").then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="border p-4">
          <h2>Subscribers</h2>
          <p>{data.totalSubscribers}</p>
        </div>

        <div className="border p-4">
          <h2>MRR</h2>
          <p>${data.mrr}</p>
        </div>

        <div className="border p-4">
          <h2>Revenue</h2>
          <p>${data.totalRevenue}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;