import { useEffect, useState } from "react";
import arrowImg from "../../../assets/images/profile/arrow.svg";
import emptyImg from "../../../assets/images/profile/empty.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

export default function RecallP() {
  const [data, setData] = useState([]);
  const [show, setShow] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem("token");

      const decode = jwtDecode(token);

      const res = await axios.get(
        `${process.env.REACT_APP_HOST}/recall/user/${decode._id}`
      );

      setData(res.data);
    };

    getData();
  }, []);

  return (
    <>
      <h1>{t("profile.recall.h1")}</h1>
      <div className="pf-b">
        {data.length > 0 ? (
          data.map((item) => (
            <div
              className={`profile-block ${
                show.includes(item._id) ? "active" : ""
              }`}
            >
              <div
                className="profile-block-btn"
                onClick={() =>
                  setShow((prev) => {
                    if (prev.includes(item._id))
                      return prev.filter((f) => f !== item._id);
                    else return [...prev, item._id];
                  })
                }
              >
                <div>
                  <h2>{item.productName}</h2>
                </div>
                <img src={arrowImg} alt="arrow" width={17} />
              </div>
              <div>
                <div className="profile-show2">
                  <div>
                    <div className="profile-info">
                      <div>{t("profile.recall.rec")}</div>
                      <div>{item.message}</div>
                    </div>
                  </div>
                  <div>
                    <div className="profile-info">
                      <div>{t("profile.recall.raiting")}</div>
                      <div>
                        {item.star}{" "}
                        {item.star === 5
                          ? t("profile.recall.five")
                          : item.star === 4
                          ? t("profile.recall.four")
                          : item.star === 3
                          ? t("profile.recall.three")
                          : item.star === 2
                          ? t("profile.recall.two")
                          : item.star === 1
                          ? t("profile.recall.one")
                          : t("profile.recall.zero")}
                      </div>
                    </div>
                    <div className="profile-info">
                      <div>{t("profile.recall.date")}</div>
                      <div>
                        {new Date(item.dataCreate).toLocaleDateString("ru-RU")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="profile_empty">
            <img src={emptyImg} alt="empty" />
            <div>{t("profile.recall.nf1")}</div>
            <div>{t("profile.recall.nf2")}</div>
          </div>
        )}
      </div>
    </>
  );
}
