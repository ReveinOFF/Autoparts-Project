import axios from "axios";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminHome() {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Number of Registrations",
        data: [],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  });

  const getStats = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_HOST}/authentication/get-user-statistic`
    );
    setData({
      labels: res.data.map((item) => new Date(item.date).toLocaleDateString()),
      datasets: [
        {
          label: "Number of Registrations",
          data: res.data.map((item) => item.count),
          fill: false,
          backgroundColor: "rgb(75, 192, 192)",
          borderColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    });
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <div className="container_a">
      <h1 style={{ textAlign: "center" }}>Статистика</h1>
      <h2>Регістрації</h2>
      <Line data={data} options={options} />
      <h2>Закази</h2>
    </div>
  );
}
