import profileImg from "../../../assets/images/profile/profile.svg";
import arrowImg from "../../../assets/images/profile/arrow.svg";
import contactImg from "../../../assets/images/profile/contact.svg";
import deliveryImg from "../../../assets/images/profile/delivery.svg";
import logImg from "../../../assets/images/profile/login.svg";
import delImg from "../../../assets/images/profile/del.svg";
import vinImg from "../../../assets/images/profile/vin.svg";
import styles from "./main.module.css";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function Profile() {
  const state = useSelector((s) => s.profile);
  const [showB1, setShowB1] = useState(false);
  const [showB2, setShowB2] = useState(false);
  const [showB3, setShowB3] = useState(false);
  const [showB4, setShowB4] = useState(false);
  const [showB5, setShowB5] = useState(false);

  return (
    <>
      <h1>Особисті дані</h1>
      <div className="pf-b">
        <div className={`profile-block ${showB1 ? "active" : ""}`}>
          <div className="profile-block-btn" onClick={() => setShowB1(!showB1)}>
            <div>
              <img src={profileImg} alt="profile" width={18} />
              <h2>Особисті дані</h2>
            </div>
            <img src={arrowImg} alt="arrow" width={17} />
          </div>
          <div>
            <div className={`profile-ins ${styles.p1}`}>
              <div className="profile-info">
                <div>Прізвище</div>
                <div>{state?.surname || "Не вказано"}</div>
              </div>
              <div className="profile-info">
                <div>Ім`я</div>
                <div>{state?.name || "Не вказано"}</div>
              </div>
              <div className="profile-info">
                <div>По-батькові (необов`язково)</div>
                <div>{state?.patronymic || "Не вказано"}</div>
              </div>
              <div className="profile-info">
                <div>Дата народження</div>
                <div>{state?.birthday || "Не вказано"}</div>
              </div>
              <div className="profile-info">
                <div>Стать</div>
                <div>{state?.sex || "Не вказано"}</div>
              </div>
            </div>
            <button className="profile-btn">Редагувати</button>
          </div>
        </div>
        <div className={`profile-block ${showB2 ? "active" : ""}`}>
          <div className="profile-block-btn" onClick={() => setShowB2(!showB2)}>
            <div>
              <img src={contactImg} alt="profile" width={18} />
              <h2>Контакти</h2>
            </div>
            <img src={arrowImg} alt="arrow" width={17} />
          </div>
          <div>
            <div className={`profile-ins ${styles.p1}`}>
              <div className="profile-info">
                <div>Електронна пошта</div>
                <div>{state?.email || "Не вказано"}</div>
              </div>
            </div>
            <button className="profile-btn">Редагувати</button>
          </div>
        </div>
        <div className={`profile-block ${showB3 ? "active" : ""}`}>
          <div className="profile-block-btn" onClick={() => setShowB3(!showB3)}>
            <div>
              <img src={deliveryImg} alt="profile" width={18} />
              <h2>Контакти</h2>
            </div>
            <img src={arrowImg} alt="arrow" width={17} />
          </div>
          <div>
            <div className={`profile-ins ${styles.p2}`}>
              <div className="profile-info">
                <div>Місто</div>
                <div>
                  <input type="text" className="profile-inp1" />
                </div>
              </div>
              <div className="profile-info">
                <div>Вулиця</div>
                <div>
                  <input type="text" className="profile-inp2" />
                </div>
              </div>
              <div className="profile-info">
                <div>Будинок</div>
                <div>
                  <input type="text" className="profile-inp2" />
                </div>
              </div>
              <div className="profile-info">
                <div>Квартира</div>
                <div>
                  <input type="text" className="profile-inp2" />
                </div>
              </div>
              <img src={delImg} alt="delete" width={25} />
            </div>
            <button className="profile-btn">Редагувати</button>
          </div>
        </div>
        <div className={`profile-block ${showB4 ? "active" : ""}`}>
          <div className="profile-block-btn" onClick={() => setShowB4(!showB4)}>
            <div>
              <img src={logImg} alt="profile" width={18} />
              <h2>Логін</h2>
            </div>
            <img src={arrowImg} alt="arrow" width={17} />
          </div>
          <div>
            <div className={`profile-ins ${styles.p1}`}>
              <div className="profile-info">
                <div>Логін (електронна пошта)</div>
                <div>{state?.login || "Не вказано"}</div>
              </div>
            </div>
            <button className="profile-btn">Редагувати</button>
          </div>
        </div>
        <div className={`profile-block ${showB5 ? "active" : ""}`}>
          <div className="profile-block-btn" onClick={() => setShowB5(!showB5)}>
            <div>
              <img src={vinImg} alt="profile" width={18} />
              <h2>Додаткова інформація</h2>
            </div>
            <img src={arrowImg} alt="arrow" width={17} />
          </div>
          <div>
            <div className={`profile-ins ${styles.p2}`}>
              <div className="profile-info">
                <div>VIN номер автомобіля</div>
                <div>
                  <input
                    type="text"
                    className="profile-inp1"
                    style={{ width: "calc(100% + 50px)" }}
                  />
                </div>
              </div>
            </div>
            <button className="profile-btn">Редагувати</button>
          </div>
        </div>
      </div>
    </>
  );
}
