import { useState } from "react";
import arrowImg from "../../../assets/images/profile/arrow.svg";

export default function OrdersP() {
  const [showOrder, setShowOrder] = useState();

  return (
    <>
      <h1>Мої замовлення</h1>
      <div className="pf-b">
        <div className={`profile-block active`}>
          <div className="profile-block-btn">
            <div>
              <h2>Замовлення #1</h2>
            </div>
            <img src={arrowImg} alt="arrow" width={17} />
          </div>
          <div>
            <div className="profile-show">
              <div>1</div>
              <div>
                <div className="profile-info">
                  <div>Назва товару</div>
                  <div>sdgsgdsgs</div>
                </div>
                <div className="profile-info">
                  <div>Кількість</div>
                  <div>1</div>
                </div>
                <div className="profile-info">
                  <div>Сумма</div>
                  <div>0.00$</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
