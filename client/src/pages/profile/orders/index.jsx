import { useState } from "react";
import arrowImg from "../../../assets/images/profile/arrow.svg";
import { useSelector } from "react-redux";

export default function OrdersP() {
  const [show, setShow] = useState([]);
  const state = useSelector((s) => s.profile);

  return (
    <>
      <h1>Мої замовлення</h1>
      <div className="pf-b">
        {state?.orders?.length > 0
          ? state.orders.map((item, index) => (
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
                    <h2>Замовлення #{index + 1}</h2>
                  </div>
                  <img src={arrowImg} alt="arrow" width={17} />
                </div>
                <div>
                  {item?.productIds.map((item2, index2) => (
                    <div className="profile-show" key={index2}>
                      <div>{index2 + 1}</div>
                      <div>
                        <div className="profile-info">
                          <div>Назва товару</div>
                          <div>{item2.name}</div>
                        </div>
                        <div className="profile-info">
                          <div>Кількість</div>
                          <div>{item2.quantity}</div>
                        </div>
                        <div className="profile-info">
                          <div>Сумма</div>
                          <div>{item2.price}$</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          : "Пусто"}
      </div>
    </>
  );
}
