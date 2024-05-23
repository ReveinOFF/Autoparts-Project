import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./home_a.module.css";
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

  const [dataO, setDataO] = useState({
    labels: [],
    datasets: [
      {
        label: ["active", "cancel", "ready"],
        data: [],
        fill: false,
        borderColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
    ],
  });

  const [order, setOrder] = useState([]);

  const getStatsUser = async () => {
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

  const getStatsOrder = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_HOST}/order/statistic`
    );

    const statuses = Object.keys(res.data);
    const dates = Array.from(
      new Set(
        statuses.flatMap((status) =>
          res.data[status].map(
            (stat) => new Date(stat.date).toISOString().split("T")[0]
          )
        )
      )
    ).sort();

    const reversedDates = dates.reverse();

    const datasets = statuses.map((status) => {
      return {
        label: status,
        data: reversedDates.map((date) => {
          const stat = res.data[status].find(
            (s) => new Date(s.date).toISOString().split("T")[0] === date
          );
          return stat ? stat.count : 0;
        }),
        fill: false,
        borderColor: getColorForStatus(status),
        tension: 0.1,
      };
    });

    setDataO({
      labels: dates,
      datasets: datasets,
    });
  };

  const getActiveOrders = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_HOST}/order/get-active`
    );

    setOrder(res.data);
  };

  const getColorForStatus = (status) => {
    switch (status) {
      case "active":
        return "rgba(75, 192, 192, 1)";
      case "cancel":
        return "rgba(255, 99, 132, 1)";
      default:
        return "rgba(153, 102, 255, 1)";
    }
  };

  useEffect(() => {
    getStatsUser();
    getStatsOrder();
    getActiveOrders();
  }, []);

  return (
    <div className="container_a">
      <h1 style={{ textAlign: "center" }}>Статистика</h1>
      <h2>Регістрації</h2>
      <Line
        data={data}
        style={{ width: "700px", height: "500px" }}
        width="700px"
        height="500px"
      />
      <h2 style={{ marginTop: "70px" }}>Закази</h2>
      <Line
        data={dataO}
        style={{ width: "700px", height: "500px" }}
        width="700px"
        height="500px"
      />
      <h2 style={{ marginTop: "70px", textAlign: "center" }}>
        Список активних заказів
      </h2>
      <div className={styles.orders_list}>
        {order
          ?.sort((a, b) => new Date(b.dataCreate) - new Date(a.dataCreate))
          ?.map((item) => (
            <div key={item._id} className={styles.order_block}>
              <div className={styles.order_inf}>
                <div>
                  <strong>Статус:</strong> {item.status}
                </div>
                <div>
                  <strong>Кількість товарів:</strong> {item.productIds.length}
                </div>
              </div>
              <div>{new Date(item.dataCreate).toLocaleDateString("ru-RU")}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
