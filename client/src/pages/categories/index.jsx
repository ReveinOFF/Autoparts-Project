import axios from "axios";
import { useEffect, useState } from "react";
import arrowPage from "../../assets/images/main/arrow_page.svg";
import { Link, useParams, useSearchParams } from "react-router-dom";
import styles from "./categories.module.css";
import arr from "../../assets/images/arrow.svg";

export default function Categories() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState([]);

  const findCateg = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_HOST}/categories/cat-mod/${id}`
    );

    setData(res.data);
  };

  useEffect(() => {
    findCateg();
  }, []);

  return (
    <div className="container" style={{ marginBottom: 60 }}>
      <div className="pages">
        {searchParams
          .get("pages")
          .split("/")
          .map((item, index, array) => (
            <>
              <div key={index}>{item}</div>
              {index !== array.length - 1 && (
                <img
                  key={`arrow-${index}`}
                  src={arrowPage}
                  alt="arrow page"
                  width={10}
                />
              )}
            </>
          ))}
      </div>
      <h1 className={styles.h1}>
        Каталог запчастин{" "}
        <span>{searchParams.get("pages").replace("/", " ")}</span>
      </h1>
      <div className={styles.category_block}>
        {data?.length > 0 ? (
          data.map((item) => (
            <div className={styles.category}>
              <div
                className={styles.top}
                style={{
                  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('${process.env.REACT_APP_IMG}${item.image}')`,
                }}
              >
                <h2>{item.title}</h2>
                <div>{item.count}</div>
              </div>
              <div className={styles.mid}>
                {item.subcategories?.map((sc) => (
                  <Link to={`/subcategories/${sc._id}`}>{sc.title}</Link>
                ))}
              </div>
              {item.subcategories?.length > 7 && (
                <Link
                  to={`/subcategories/a/${item._id}`}
                  className={styles.bot}
                >
                  <div>Показати все</div>
                  <img src={arr} alt="arrow" width={15} />
                </Link>
              )}
            </div>
          ))
        ) : (
          <div>Пусто</div>
        )}
      </div>
    </div>
  );
}
