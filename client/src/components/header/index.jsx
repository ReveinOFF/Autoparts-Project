import styles from "./header.module.css";
import heartImg from "../../assets/images/header/heart.svg";
import phoneImg from "../../assets/images/header/phone.svg";
import clientImg from "../../assets/images/header/client.svg";
import logoImg from "../../assets/images/header/logo.svg";
import cartImg from "../../assets/images/header/cart.svg";
import searchImg from "../../assets/images/header/search.svg";
import arrowImg from "../../assets/images/header/arrow.svg";
import arrowTwoImg from "../../assets/images/header/arrowTwo.svg";
import burgerImg from "../../assets/images/header/burger.svg";
import uaImg from "../../assets/images/header/ua.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { AUTH_USER_ACTION } from "../../reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_DATA_USER_ACTION } from "../../reducers/profileReducer";
import axios from "axios";

export default function Header() {
  const [course, setCourse] = useState(localStorage.getItem("course") || "uah");
  const { i18n } = useTranslation();
  const location = useLocation();
  const { isAuth } = useSelector((s) => s.auth);
  const state = useSelector((s) => s.cart);
  const dispatch = useDispatch();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lng", lang);
  };

  const changeCourse = (course) => {
    localStorage.setItem("course", course);
    setCourse(course);
  };

  const logout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_HOST}/authentication/logout`);
      dispatch({ type: AUTH_USER_ACTION, payload: { isAuth: false } });
      dispatch({ type: DEFAULT_DATA_USER_ACTION });
      localStorage.removeItem("token");
      window.location.reload();
    } catch (error) {}
  };

  return (
    <header>
      <div className={`flex-between ${styles.header_top}`}>
        <div className="container flex-between">
          <div className={styles.h_top_l}>
            <Link to="/favourites" className="flex-align">
              <img src={heartImg} alt="heart" width={20} height={20} />
              Обрані
            </Link>
            <Link
              to="tel:+38012312312"
              className={`flex-align ${styles.orange}`}
            >
              <img src={phoneImg} alt="phone" width={20} height={20} />
              +38012312312
            </Link>
          </div>
          <div className={styles.h_top_r}>
            {isAuth ? (
              <button onClick={logout} className="flex-align">
                <img src={clientImg} alt="client" width={20} height={20} />{" "}
                Вийти
              </button>
            ) : (
              <Link to="/login" className="flex-align">
                <img src={clientImg} alt="client" width={20} height={20} />{" "}
                Увійти/Створити кабінет
              </Link>
            )}
            <div>
              <div className={`flex-align ${styles.select_block}`}>
                <div style={{ fontSize: 18 }}>
                  {course === "uah" ? "₴" : "$"}
                </div>
                <div>{course === "uah" ? "UAH" : "DOL"}</div>
                <img src={arrowTwoImg} alt="arrow" width={12} height={12} />
              </div>
              <div></div>
            </div>
            <div>
              <div className={`flex-align ${styles.select_block}`}>
                <img src={uaImg} alt="ukraine" width={20} height={15} />
                <div>Мова</div>
                <img src={arrowTwoImg} alt="arrow" width={12} height={12} />
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.mid_h}>
        <div className={`container ${styles.header_middle}`}>
          <Link to="/">
            <img src={logoImg} alt="logo" />
          </Link>
          <div className={styles.search_block}>
            <input
              type="text"
              placeholder="Пошук за назвою товару, номер і тд."
            />
            <button>
              <img src={searchImg} alt="search" width={20} height={20} />
            </button>
          </div>
          <div className={`flex-full ${styles.cart_block}`}>
            <div className={styles.cart}>
              <img src={cartImg} alt="cart" width={30} height={30} />
              <div>{state.count}</div>
            </div>
            <div className={styles.cart_info}>
              <div>Кошик</div>
              <div>{state.totalPrice}$</div>
            </div>
          </div>
        </div>
      </div>
      {location.pathname === "/login" ||
      location.pathname === "/registration" ? null : (
        <div className={styles.header_bottom}>
          <nav className="container">
            <div className={styles.category}>
              <div className="flex-align">
                <img src={burgerImg} alt="burger" width={15} height={15} />
                <div>Категорії</div>
                <img src={arrowImg} alt="arrow" width={10} height={10} />
              </div>
              <div></div>
            </div>
            <NavLink to="/">Головна</NavLink>
            <NavLink to="/contact">Контакти</NavLink>
            <NavLink to="/about">Про нас</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
