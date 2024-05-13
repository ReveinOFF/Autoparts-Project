import styles from "./header.module.css";
import homeImg from "../../../assets/images/auth/home.svg";
import arrowSVG from "../../../assets/images/admin/ha_am.svg";
import setSVG from "../../../assets/images/admin/ha_set.svg";
import exitSVG from "../../../assets/images/admin/ha_exit.svg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { DEFAULT_DATA_USER_ACTION } from "../../../reducers/profileReducer";
import { AUTH_USER_ACTION } from "../../../reducers/authReducer";
import { useState } from "react";

export default function AdminHeader() {
  const { isAuth } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const logout = async () => {
    await axios.post(`${process.env.REACT_APP_HOST}/authentication/logout`);
    dispatch({ type: AUTH_USER_ACTION, payload: { isAuth: false } });
    dispatch({ type: DEFAULT_DATA_USER_ACTION });
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className={`${styles.header} flex-between`}>
      <div>Панель Адміністратора</div>
      <div>
        <Link to="/" className="flex-full">
          <img src={homeImg} alt="home" width={25} height={25} />
          <div>Повернутись до сайту</div>
        </Link>
        {isAuth && (
          <div>
            <button
              className="flex-full"
              onClick={() => setShowModal(!showModal)}
            >
              Адмін <img src={arrowSVG} alt="arrow" width={15} />
            </button>
            <div
              className={`${styles.modal} ${showModal ? styles.active : null}`}
            >
              <Link to="/admin/edit/settings" className="flex-align">
                <img src={setSVG} alt="setting" width={15} /> Налаштування
              </Link>
              <button className="flex-align" onClick={logout}>
                <img src={exitSVG} alt="setting" width={15} />
                Вихід
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
