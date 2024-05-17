import { useEffect, useState } from "react";
import styles from "./mark.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BrandHttp } from "../../../http/BrandHttp";

export default function AdminMark() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const getModeleWithMark = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_HOST}/modele/a-modele-mark`
    );

    setData(res.data);
  };

  useEffect(() => {
    getModeleWithMark();
  }, []);

  const deleteModel = async (id) => {
    await BrandHttp.delModele(id);
    window.location.reload();
  };

  const deleteMark = async (id) => {
    await BrandHttp.delBrand(id);
    window.location.reload();
  };

  return (
    <div className="container_a">
      <h1 className={styles.h1}>Маркі та моделі</h1>
      <div className={styles.create_btn}>
        <button onClick={() => navigate(`mk/add`)}>Створити марку</button>
        <button onClick={() => navigate(`ml/add`)}>Створити модель</button>
      </div>
      {data?.map((item) => (
        <div key={item.markId} className={styles.mark_block}>
          <div className={styles.mark_info}>
            <img
              src={`${process.env.REACT_APP_IMG}${item.markImage}`}
              alt="mark"
              width={100}
            />
            <h2>{item.markTitle}</h2>
            <div>
              <button onClick={() => navigate(`mk/${item.markId}`)}>
                Змінити
              </button>
              <button onClick={() => deleteMark(item.markId)}>Видалити</button>
            </div>
          </div>
          <div className={styles.model_block}>
            {item.modele?.map((val) => (
              <div key={val._id}>
                <img
                  src={`${process.env.REACT_APP_IMG}${val.image}`}
                  alt="model"
                  width={80}
                />
                <div className={styles.model_info}>
                  <div>{val.title}</div>
                  <div>{val.description}</div>
                </div>
                <div className={styles.model_btn}>
                  <button onClick={() => navigate(`ml/${val._id}`)}>
                    Змінити
                  </button>
                  <button onClick={() => deleteModel(val._id)}>Видалити</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
