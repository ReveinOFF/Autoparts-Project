import { useEffect, useState } from "react";
import arrowImg from "../../../assets/images/profile/arrow.svg";
import emptyImg from "../../../assets/images/profile/empty.png";
import { useSelector } from "react-redux";
import axios from "axios";
import CurrencyConverter from "../../../components/currencyConverter";
import { useTranslation } from "react-i18next";

export default function OrdersP() {
  const [show, setShow] = useState([]);
  const state = useSelector((s) => s.profile);
  const [curr, setCurr] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const GetCurr = async () => {
      const res = await axios.get(`${process.env.REACT_APP_HOST}/currency`);

      setCurr(res.data);
    };

    GetCurr();
  }, []);

  return (
    <>
      <h1>{t("profile.order.h1")}</h1>
      <div className="pf-b">
        {state?.orders?.length > 0 ? (
          state.orders.map((item, index) => (
            <div
              className={`profile-block ${
                show.includes(item._id) ? "active" : ""
              }`}
              key={index}
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
                  <h2>
                    {t("profile.order.order")} #{index + 1}
                  </h2>
                </div>
                <img src={arrowImg} alt="arrow" width={17} />
              </div>
              <div>
                {item?.productIds.map((item2, index2) => (
                  <div className="profile-show" key={index2}>
                    <div>{index2 + 1}</div>
                    <div>
                      <div className="profile-info">
                        <div>{t("profile.order.name")}</div>
                        <div>{item2.name}</div>
                      </div>
                      <div className="profile-info">
                        <div>{t("profile.order.count")}</div>
                        <div>{item2.quantity}</div>
                      </div>
                      <div className="profile-info">
                        <div>{t("profile.order.price")}</div>
                        <CurrencyConverter
                          amount={item2.price}
                          exchangeRates={curr}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="profile_empty">
            <img src={emptyImg} alt="empty" />
            <div>{t("profile.order.nf1")}</div>
            <div>{t("profile.order.nf2")}</div>
          </div>
        )}
      </div>
    </>
  );
}
