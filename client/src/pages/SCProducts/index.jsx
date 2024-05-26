import { useParams, useSearchParams } from "react-router-dom";
import styles from "./scproducts.module.css";
import { useEffect, useState } from "react";
import arrowSVG from "../../assets/images/header/arrowTwo.svg";
import axios from "axios";
import ProductsComponent from "../../components/products";

export default function SCProducts() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMark, setShowMark] = useState();
  const [showModel, setShowModel] = useState();
  const [dataMark, setDataMark] = useState([]);
  const [selectMark, setSelectMark] = useState({});
  const [selectModel, setSelectModel] = useState({});
  const [dataModel, setDataModel] = useState([]);
  const [sDataModel, setSDataModel] = useState([]);
  const [data, setData] = useState();

  const getMark = async () => {
    const res = await axios.get(`${process.env.REACT_APP_HOST}/mark/all-mark`);

    setDataMark(res.data);
  };

  const getModel = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_HOST}/modele/all-modele`
    );

    setDataModel(res.data);
    setSDataModel(res.data);
  };

  useEffect(() => {
    getMark();
    getModel();
  }, []);

  useEffect(() => {
    setSDataModel(
      dataModel?.filter((item) => item?.markIds?.includes(selectMark?._id))
    );
  }, [selectMark]);

  const findProd = () => {
    // if (selectMark.title && selectMark.title)
  };

  return (
    <div className="container" style={{ marginBlock: 40 }}>
      <div className={styles.info}>
        <hgroup>{searchParams.get("t1")}</hgroup>
        <h1>{searchParams.get("t2")}</h1>
      </div>
      <div className={styles.selector}>
        <div className={styles.category}>
          <button
            onClick={() => setShowMark(!showMark)}
            className={showMark ? styles.active : ""}
          >
            <span>
              {selectMark.title ? selectMark.title : "Виберіть марку"}
            </span>
            <img src={arrowSVG} alt="arrow" />
          </button>
          <div
            className={`${styles.top_select} ${showMark ? styles.active : ""}`}
          >
            {dataMark?.map((item) => (
              <button
                onClick={() => {
                  setSelectMark(item);
                  setShowMark(false);
                }}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.category}>
          <button
            onClick={() => {
              if (selectMark?.title) setShowModel(!showModel);
            }}
            className={showModel ? styles.active : ""}
            style={{
              cursor: selectMark?.title ? "pointer" : "not-allowed",
            }}
          >
            <span>
              {selectModel.title ? selectModel.title : "Виберіть модель"}
            </span>
            <img src={arrowSVG} alt="arrow" />
          </button>
          <div
            className={`${styles.top_select} ${showModel ? styles.active : ""}`}
          >
            {sDataModel?.map((item) => (
              <button
                onClick={() => {
                  setSelectModel(item);
                  setShowModel(false);
                }}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
        <button className={styles.cat_btn} onClick={findProd}>
          Пошук
        </button>
      </div>
      <ProductsComponent />
    </div>
  );
}
