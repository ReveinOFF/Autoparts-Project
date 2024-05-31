import { Link, useParams, useSearchParams } from "react-router-dom";
import arrowPage from "../../assets/images/main/arrow_page.svg";
import styles from "./subcategories.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function SubCategories() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState({});
  const { t } = useTranslation();

  const findSubCat = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_HOST}/categories/get-sub-cat/${id}`
    );

    setData(res.data);
  };

  useEffect(() => {
    findSubCat();
  }, []);

  return (
    <div className="container" style={{ marginBottom: 60 }}>
      <div className="pages">
        {searchParams
          ?.get("pages")
          ?.split("/")
          ?.map((item, index, array) => (
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
      <h1 className={styles.h1}>{data?.title}</h1>
      {data?.subCategories?.length < 1 && <p>{t("empty")}</p>}
      <div className={styles.subcategories}>
        {data?.subCategories?.map((item) => (
          <div className={styles.subcategory}>
            <h2>{item.title}</h2>
            {item?.subChildCategories?.length < 1 && <p>{t("empty")}</p>}
            <div className={styles.list}>
              {item.subChildCategories?.map((item2) => (
                <>
                  {item2.count > 0 ? (
                    <Link
                      to={`/s/products/${item2._id}?pages=${searchParams.get(
                        "pages"
                      )}/${item2.title}`}
                    >
                      {item2.title} ({item2.count})
                    </Link>
                  ) : (
                    <div>
                      {item2.title} ({item2.count})
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
