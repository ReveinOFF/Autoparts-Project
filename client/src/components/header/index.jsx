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
import enImg from "../../assets/images/header/en.png";
import exitImg from "../../assets/images/header/exit.svg";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { AUTH_USER_ACTION } from "../../reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_DATA_USER_ACTION } from "../../reducers/profileReducer";
import axios from "axios";
import getSymbolFromCurrency from "currency-symbol-map";
import Cart from "../cart";
import { DATA_CURR_ACTION } from "../../reducers/currReducer";
import CurrencyConverter from "../currencyConverter";

export default function Header() {
  const [course, setCourse] = useState(
    localStorage.getItem("course")
      ? JSON.parse(localStorage.getItem("course"))
      : { key: "usd", course: 1 }
  );
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { isAuth } = useSelector((s) => s.auth);
  const state = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const [showCategory, setShowCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showLng, setShowLng] = useState(false);
  const [showCurr, setShowCurr] = useState(false);
  const [lng, setLng] = useState({});
  const [curr, setCurr] = useState([]);
  const navigate = useNavigate();

  const eventBlockClose = (e) => {
    if (!e.target.closest("#category-block")) setShowCategory(false);
  };

  useEffect(() => {
    if (showCategory) {
      document.addEventListener("click", eventBlockClose);
    } else {
      document.removeEventListener("click", eventBlockClose);
    }

    return () => {
      document.removeEventListener("click", eventBlockClose);
    };
  }, [showCategory]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}/categories/header-cat`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((e) => alert(e));
  }, []);

  useEffect(() => {
    const GetLng = async () => {
      const res = await axios.get(`${process.env.REACT_APP_HOST}/lang`);

      setLng(res.data);
    };

    GetLng();
  }, []);

  useEffect(() => {
    const GetCurr = async () => {
      const res = await axios.get(`${process.env.REACT_APP_HOST}/currency`);

      setCurr(res.data);
    };

    GetCurr();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token"))
      dispatch({ type: AUTH_USER_ACTION, payload: { isAuth: true } });
  }, []);

  const searchProduct = () => {
    if (searchValue.length > 0) {
      axios
        .post(
          `${process.env.REACT_APP_HOST}/product/search-product`,
          { text: searchValue },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          setProducts(res.data);
        })
        .catch((e) => alert(e));
    }
  };

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lng", lang);
  };

  const changeCourse = (course) => {
    localStorage.setItem("course", JSON.stringify(course));
    setCourse(course);
    dispatch({ type: DATA_CURR_ACTION, payload: course });
    window.location.reload();
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
      {showCart && (
        <div className="cart_modal">
          <Cart onClose={() => setShowCart(false)} />
        </div>
      )}
      <div className={`flex-between ${styles.header_top}`}>
        <div className="container flex-between">
          <div className={styles.h_top_l}>
            <Link
              to={isAuth ? "/profile/favourites" : "/favourites"}
              className="flex-align"
            >
              <img src={heartImg} alt="heart" width={20} height={20} />
              {t("header.l-fav")}
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
              <div style={{ display: "flex" }} className={styles.p1}>
                <button
                  onClick={() => navigate("/profile")}
                  className="flex-align"
                  style={{ fontSize: 15 }}
                >
                  <img src={clientImg} alt="client" width={15} height={15} />{" "}
                  {t("header.profile")}
                </button>
                <button
                  onClick={logout}
                  className="flex-align"
                  style={{ fontSize: 15 }}
                >
                  <img src={exitImg} alt="client" width={15} height={15} />{" "}
                  {t("header.exit")}
                </button>
              </div>
            ) : (
              <Link to="/login" className={`flex-align ${styles.p11}`}>
                <img src={clientImg} alt="client" width={20} height={20} />{" "}
                {t("header.log")}
              </Link>
            )}
            <div style={{ position: "relative" }} className={styles.p2}>
              <div
                className={`flex-align ${styles.select_block} ${
                  showCurr ? styles.active : ""
                }`}
                onClick={() => setShowCurr(!showCurr)}
              >
                <div style={{ fontSize: 18 }}>
                  {getSymbolFromCurrency(course.key)}
                </div>
                <div>{course.key.toLocaleUpperCase()}</div>
                <img src={arrowTwoImg} alt="arrow" width={12} height={12} />
              </div>
              <div
                className={`${styles.modal_top} ${
                  showCurr ? styles.active : ""
                }`}
              >
                {curr
                  .filter((item) => item.key !== course.key)
                  .map((item) => (
                    <button key={item._id} onClick={() => changeCourse(item)}>
                      <span>{getSymbolFromCurrency(item.key)}</span>{" "}
                      <span>{item.key.toLocaleUpperCase()}</span>
                    </button>
                  ))}
              </div>
            </div>
            <div style={{ position: "relative" }} className={styles.p3}>
              <div
                className={`flex-align ${styles.select_block} ${
                  showLng ? styles.active : ""
                }`}
                onClick={() => setShowLng(!showLng)}
              >
                {i18n.language === "en" ? (
                  <img src={enImg} alt="english" width={20} height={15} />
                ) : (
                  <img src={uaImg} alt="ukraine" width={20} height={15} />
                )}
                <div>{t("header.lng")}</div>
                <img src={arrowTwoImg} alt="arrow" width={12} height={12} />
              </div>
              {lng?.en && i18n.language === "ua" ? (
                <div
                  className={`${styles.modal_top} ${
                    showLng ? styles.active : ""
                  }`}
                >
                  <button onClick={() => changeLang("en")}>
                    <img src={enImg} alt="english" width={20} height={15} />
                    <span>EN</span>
                  </button>
                </div>
              ) : lng?.ua && i18n.language === "en" ? (
                <div
                  className={`${styles.modal_top} ${
                    showLng ? styles.active : ""
                  }`}
                >
                  <button onClick={() => changeLang("ua")}>
                    <img src={uaImg} alt="ukraine" width={20} height={15} />
                    <span>UA</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.mid_h}>
        <div className={`container ${styles.header_middle}`}>
          <Link to="/">
            <img src={logoImg} alt="logo" />
          </Link>
          <div
            className={`${styles.search_block} ${
              products.length > 0 ? styles.search_active : null
            }`}
          >
            <input
              type="text"
              placeholder={t("header.search")}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setProducts([]);
              }}
            />
            <button onClick={searchProduct}>
              <img src={searchImg} alt="search" width={20} height={20} />
            </button>
            <div className={styles.search_f}>
              {products?.map((item) => (
                <Link
                  to={`/product/${item._id}?pages=${t("search")}`}
                  key={item._id}
                >
                  <img src={searchImg} alt="search" width={15} height={15} />{" "}
                  {item.title}
                </Link>
              ))}
            </div>
            {products?.length < 1 && (
              <div className={styles.prod_nf}>{t("header.prod-notf")}</div>
            )}
          </div>
          <div
            className={`flex-full ${styles.cart_block}`}
            onClick={() => setShowCart(true)}
          >
            <div className={styles.cart}>
              <img src={cartImg} alt="cart" width={30} height={30} />
              <div>{state.count}</div>
            </div>
            <div className={styles.cart_info}>
              <div>{t("header.cart")}</div>
              <CurrencyConverter
                amount={state.totalPrice}
                exchangeRates={curr}
              />
            </div>
          </div>
        </div>
      </div>
      {location.pathname === "/login" ||
      location.pathname === "/registration" ? null : (
        <div className={styles.header_bottom}>
          <nav className="container">
            <div
              className={`${styles.category} ${
                showCategory ? styles.active_cat : null
              }`}
              id="category-block"
            >
              <div
                className="flex-align"
                onClick={() => setShowCategory(!showCategory)}
              >
                <img src={burgerImg} alt="burger" width={15} height={15} />
                <div className={styles.show_k}>{t("header.category")}</div>
                <div className={styles.show_m}>{t("header.menu")}</div>
                <img src={arrowImg} alt="arrow" width={10} height={10} />
              </div>
              <div className={styles.cat_modal}>
                {categories?.map((item) => (
                  <div>
                    <span>{item.title}</span>
                    <img src={arrowImg} alt="arrow" width={10} height={10} />
                    {item?.subCategorieIds?.length > 0 && (
                      <div className={styles.subcat}>
                        {item?.subCategories?.map((item2) => (
                          <>
                            {item2?.subChildCategorieIds?.length > 0 ? (
                              <div>
                                <span>{item2.title}</span>
                                <img
                                  src={arrowImg}
                                  alt="arrow"
                                  width={10}
                                  height={10}
                                />
                                {item2?.subChildCategorieIds?.length > 0 && (
                                  <div className={styles.subchildcat}>
                                    {item2.subChildCategories?.map((item3) => (
                                      <Link
                                        to={`/sc/products/${item3._id}?t0=${item.title}&t1=${item2.title}&t2=${item3.title}`}
                                        onClick={() => setShowCategory(false)}
                                      >
                                        <span>{item3.title}</span>
                                        <img
                                          src={arrowImg}
                                          alt="arrow"
                                          width={10}
                                          height={10}
                                        />
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Link
                                to={`/sc/products/${item2._id}?t0=${item.title}&t1=${item2.title}`}
                                className={styles.sec_cat_l}
                                onClick={() => setShowCategory(false)}
                              >
                                <span>{item2.title}</span>
                                <img
                                  src={arrowImg}
                                  alt="arrow"
                                  width={10}
                                  height={10}
                                />
                              </Link>
                            )}
                          </>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <NavLink to="/">{t("header.l-main")}</NavLink>
            <NavLink to="/contact">{t("header.l-contact")}</NavLink>
            <NavLink to="/about">{t("header.l-about")}</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
