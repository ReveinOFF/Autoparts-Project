import { useEffect, useState } from "react";
import styles from "./course.module.css";
import getSymbolFromCurrency from "currency-symbol-map";
import axios from "axios";
import delImg from "../../../assets/images/admin/ha_exit.svg";

export default function AdminCourse() {
  const [curr, setCurr] = useState([]);
  const [key, setKey] = useState("");
  const [course, setCourse] = useState(0.0);

  const getCurr = async () => {
    const res = await axios.get(`${process.env.REACT_APP_HOST}/currency`);

    setCurr(res.data);
  };

  useEffect(() => {
    getCurr();
  }, []);

  const deleteCurr = async (id) => {
    await axios.delete(`${process.env.REACT_APP_HOST}/currency/${id}`);

    setCurr((prev) => prev.filter((item) => item._id !== id));
  };

  const createCurr = async () => {
    if (key.length < 1) return;

    const res = await axios.post(`${process.env.REACT_APP_HOST}/currency`, {
      key: key.toLocaleLowerCase(),
      course: course,
    });

    setCurr((prev) => [...prev, res.data]);
  };

  return (
    <div className="container_a">
      <input
        type="text"
        name="key"
        placeholder="usd"
        className={styles.input}
        onChange={(e) => setKey(e.target.value)}
      />
      <input
        type="number"
        name="course"
        placeholder="0.10"
        className={styles.input}
        onChange={(e) => setCourse(e.target.value)}
      />
      <button className={styles.btn} onClick={createCurr}>
        Створити
      </button>
      <div className={styles.course_list}>
        {curr?.map((item) => (
          <div key={item._id} className={styles.course_block}>
            <div>{getSymbolFromCurrency(item.key.toLocaleUpperCase())}</div>
            <div>{item.key.toLocaleUpperCase()}</div>
            <div style={{ marginLeft: 40 }}>{item.course}</div>
            <img
              src={delImg}
              alt="delete"
              width={15}
              onClick={() => deleteCurr(item._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
