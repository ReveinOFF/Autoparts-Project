import { Link, useNavigate } from "react-router-dom";
import styles from "./checkout.module.css";
import infoImg from "../../assets/images/contact/info.svg";
import mapImg from "../../assets/images/map.svg";
import arrImg from "../../assets/images/arrow.svg";
import Image from "../../components/image/image";
import delImg from "../../assets/images/product/del.svg";
import circleImg from "../../assets/images/circle.svg";
import circleAImg from "../../assets/images/circleA.svg";
import axios from "axios";
import { useCallback, useEffect, useReducer, useState } from "react";
import {
  getCartDataWithTP,
  removeCartAll,
  removeCartItem,
} from "../../utils/cart";
import { useDispatch } from "react-redux";
import { SET_CART } from "../../reducers/cartReducer";
import { jwtDecode } from "jwt-decode";
import contactImg from "../../assets/images/contact/contact.svg";
import closeImg from "../../assets/images/admin/ha_exit.svg";
import { useTranslation } from "react-i18next";
import CurrencyConverter from "../../components/currencyConverter";

function reducer(state, action) {
  if (action.type === "update") {
    return {
      ...state,
      ...action.payload,
    };
  }
}

export default function Checkout() {
  const dispatchM = useDispatch();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, {
    surname: "",
    name: "",
    mobOrEml: "",
    city: {},
    cart: [],
    nova: {},
    ukr: "",
    showPoshta: "nova",
    showPay: "receiving",
    comment: "",
  });
  const { t } = useTranslation();
  const [curr, setCurr] = useState([]);

  const [cart, setCart] = useState({});

  const [cities, setCities] = useState([]);
  const [visibleCities, setVisibleCities] = useState([]);
  const [page, setPage] = useState(1);
  const [showCity, setShowCity] = useState(false);
  const [citySelected, setCitySelected] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(search);

  const [branches, setBranches] = useState([]);
  const [visibleBranches, setVisibleBranches] = useState([]);
  const [showNova, setShowNova] = useState(false);
  const [showUkr, setShowUkr] = useState(false);
  const [searchNova, setSearchNova] = useState("");
  const [novaSelected, setNovaSelected] = useState(null);
  const [ukrSelected, setUkrSelected] = useState(null);

  const [show, setShow] = useState(false);

  const onOrder = async () => {
    await removeCartAll();

    const res = await axios.post(
      `${process.env.REACT_APP_HOST}/order/add-order`,
      { ...state }
    );

    const token = localStorage.getItem("token");
    if (token) {
      const dat = jwtDecode(token);
      await axios.put(
        `${process.env.REACT_APP_HOST}/authentication/user/order`,
        {
          userId: dat._id,
          orderIds: res.data._id,
        }
      );
    }

    setShow(true);
  };

  useEffect(() => {
    const res = getCartDataWithTP();
    setCart(res);
    dispatch({ type: "update", payload: { cart: res } });
  }, []);

  useEffect(() => {
    const GetCurr = async () => {
      const res = await axios.get(`${process.env.REACT_APP_HOST}/currency`);

      setCurr(res.data);
    };

    GetCurr();
  }, []);

  useEffect(() => {
    const getJson = async () => {
      const allCities = await require("../../json/cities.json");
      setCities(allCities);
      setVisibleCities(allCities.slice(0, 50));
    };

    getJson();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      if (!citySelected) return;

      const object_name = cityNameConvert(citySelected?.object_name);

      const response = await axios.post(
        "https://api.novaposhta.ua/v2.0/json/",
        {
          apiKey: process.env.REACT_APP_NOVA_KEY,
          modelName: "AddressGeneral",
          calledMethod: "getWarehouses",
          methodProperties: {
            CityName: object_name,
          },
        }
      );

      setBranches(response.data.data);
      setVisibleBranches(response.data.data);
    };

    fetchBranches();
  }, [citySelected]);

  const removeCart = (id) => {
    removeCartItem(id);
    setCart((prev) => {
      const index = prev.data.findIndex((item) => item.id === id);
      if (index === -1) return prev;

      const updatedData = [...prev.data];
      updatedData.splice(index, 1);

      const totalPrice = updatedData.reduce((sum, item) => sum + item.price, 0);

      dispatch({
        type: "update",
        payload: { cart: { totalPrice: totalPrice, data: updatedData } },
      });

      return {
        totalPrice: totalPrice,
        data: updatedData,
      };
    });
    dispatchM({ type: SET_CART });
  };

  const loadMoreCities = () => {
    const newPage = page + 1;
    const newVisibleCities = cities.slice(0, newPage * 50);
    setVisibleCities(newVisibleCities);
    setPage(newPage);
  };

  const cityNameConvert = useCallback((text) => {
    let newText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    newText = newText.replace("район", "р-н").replace("область", "обл.");
    return newText;
  }, []);

  const handleScroll = (e) => {
    if (search.length > 0) return;

    const tolerance = 5;
    if (
      e.target.scrollTop + e.target.clientHeight >=
      e.target.scrollHeight - tolerance
    ) {
      if (visibleCities.length < cities.length) {
        loadMoreCities();
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(search);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      if (search.length > 0) {
        setVisibleCities(
          cities.filter(
            (item) =>
              item.object_name.toLocaleLowerCase() ===
              search.toLocaleLowerCase()
          )
        );
      } else {
        setVisibleCities(cities.slice(0, 50));
      }
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (search.length > 0) {
      setVisibleBranches(
        branches.filter((item) =>
          item.Description.toLocaleLowerCase().includes(
            searchNova.toLocaleLowerCase()
          )
        )
      );
    } else {
      setVisibleBranches(branches);
    }
  }, [searchNova]);

  return (
    <div
      className="container"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "flex-start",
        gap: "40px",
        paddingBlock: "60px",
      }}
    >
      <div className={styles.checkout}>
        {show && (
          <div className="succ">
            <div>
              <img
                src={closeImg}
                alt="close"
                onClick={() => {
                  setShow(false);
                  navigate("/");
                }}
              />
              <img src={contactImg} alt="contact" />
              <h1>{t("checkout.modh1")}</h1>
              <p>{t("checkout.modp")}</p>
            </div>
          </div>
        )}
        <h1>{t("checkout.h1")}</h1>
        <div>
          <h2>{t("checkout.h2")}</h2>
          <div>
            <div className={styles.input_top}>
              <fieldset className={styles.input_block}>
                <label htmlFor="surname">
                  {t("checkout.surname")} <img src={infoImg} alt="info" />
                </label>
                <input
                  type="text"
                  name="surname"
                  value={state.surname}
                  onChange={(e) =>
                    dispatch({
                      type: "update",
                      payload: { surname: e.target.value },
                    })
                  }
                />
              </fieldset>
              <fieldset className={styles.input_block}>
                <label htmlFor="name">
                  {t("checkout.name")} <img src={infoImg} alt="info" />
                </label>
                <input
                  type="text"
                  name="name"
                  value={state.name}
                  onChange={(e) =>
                    dispatch({
                      type: "update",
                      payload: { name: e.target.value },
                    })
                  }
                />
              </fieldset>
            </div>
            <fieldset className={styles.input_block}>
              <label htmlFor="mobOrEml">
                {t("checkout.mob")} <img src={infoImg} alt="info" />
              </label>
              <input
                type="text"
                name="mobOrEml"
                value={state.mobOrEml}
                onChange={(e) =>
                  dispatch({
                    type: "update",
                    payload: { mobOrEml: e.target.value },
                  })
                }
              />
            </fieldset>
            <fieldset className={styles.input_block}>
              <label htmlFor="city">
                {t("checkout.city")} <img src={infoImg} alt="info" />
              </label>
              <div
                className={styles.map_sel}
                style={{
                  borderBottomLeftRadius: showCity ? "0px" : "10px",
                  borderBottomRightRadius: showCity ? "0px" : "10px",
                }}
              >
                <button onClick={() => setShowCity(!showCity)}>
                  <div>
                    <img src={mapImg} alt="map" />
                    {citySelected ? (
                      <div>
                        <div>{cityNameConvert(citySelected.object_name)}</div>
                        <div>
                          {cityNameConvert(citySelected.region)},{" "}
                          {cityNameConvert(citySelected.community)}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div>{t("checkout.empty")}</div>
                        <div>{t("checkout.citys")}</div>
                      </div>
                    )}
                  </div>
                  <img src={arrImg} alt="arrow" width={15} />
                </button>
                <div
                  className={`${styles.selector} ${
                    showCity ? styles.active : ""
                  }`}
                >
                  <input
                    type="text"
                    placeholder={t("checkout.search")}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div onScroll={handleScroll}>
                    {visibleCities?.map((item) => (
                      <button
                        onClick={() => {
                          setCitySelected(item);
                          setShowCity(false);
                          dispatch({ type: "update", payload: { city: item } });
                        }}
                      >
                        <div>{cityNameConvert(item.object_name)}</div>
                        <div>
                          {cityNameConvert(item.region)},{" "}
                          {cityNameConvert(item.community)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
        <div>
          <h2>{t("checkout.order")}</h2>
          <div className={styles.cart}>
            {cart?.data?.map((item) => (
              <div className={styles.cart_item}>
                <div>
                  <Image src={item.image?.length > 3 ? item.image : ""} />
                  <div>{item.title}</div>
                </div>
                <div>
                  <div>
                    <CurrencyConverter
                      style={{ display: "inline" }}
                      amount={item.mainPrice}
                      exchangeRates={curr}
                    />{" "}
                    <span>x</span> {item.count} од.
                  </div>
                  <CurrencyConverter amount={item.price} exchangeRates={curr} />
                  <img
                    src={delImg}
                    alt="delete"
                    onClick={() => removeCart(item.id)}
                  />
                </div>
              </div>
            ))}
            <div className={styles.cart_total}>
              <div>{t("checkout.price")}</div>
              <CurrencyConverter
                amount={cart?.totalPrice}
                exchangeRates={curr}
              />
            </div>
          </div>
        </div>
        <div>
          <h2>{t("checkout.deliv")}</h2>
          <div className={styles.delivery}>
            {state?.showPoshta === "nova" ? (
              <>
                <div className={styles.sel_del_a}>
                  <img src={circleAImg} alt="circle" />
                  <div className={styles.sel_a_info}>
                    <div>
                      <div>{t("checkout.dnp")}</div>
                      <div>{t("checkout.dnp1")}</div>
                    </div>
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <button
                        onClick={() => {
                          if (branches?.length > 0) setShowNova(!showNova);
                        }}
                        style={{
                          borderBottomLeftRadius: showNova ? "0px" : "10px",
                          borderBottomRightRadius: showNova ? "0px" : "10px",
                          cursor:
                            branches?.length > 0 ? "pointer" : "not-allowed",
                        }}
                      >
                        {novaSelected ? (
                          <div>{novaSelected.Description}</div>
                        ) : (
                          <div>{t("checkout.dnpo")}</div>
                        )}
                        <img src={arrImg} alt="arrow" width={15} />
                      </button>
                      <div
                        className={`${styles.selector2} ${
                          showNova ? styles.active : ""
                        }`}
                      >
                        <input
                          type="text"
                          placeholder={t("checkout.search")}
                          onChange={(e) => setSearchNova(e.target.value)}
                        />
                        <div>
                          {visibleBranches?.map((item) => (
                            <button
                              onClick={() => {
                                setNovaSelected(item);
                                setShowNova(false);
                                dispatch({
                                  type: "update",
                                  payload: { nova: item },
                                });
                              }}
                            >
                              {item.Description}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.tarif}>
                    <div>{t("checkout.tarif")}</div>
                    <div>
                      <img src={mapImg} alt="map" />
                      <span>{t("checkout.map")}</span>
                    </div>
                  </div>
                </div>
                <div
                  className={styles.sel_del}
                  onClick={() =>
                    dispatch({ type: "update", payload: { showPoshta: "ukr" } })
                  }
                >
                  <div>
                    <img src={circleImg} alt="circle" />
                    <span>{t("checkout.urk")}</span>
                  </div>
                  <div>{t("checkout.tarif")}</div>
                </div>
              </>
            ) : (
              <>
                <div
                  className={styles.sel_del}
                  onClick={() =>
                    dispatch({
                      type: "update",
                      payload: { showPoshta: "nova" },
                    })
                  }
                >
                  <div>
                    <img src={circleImg} alt="circle" />
                    <span>{t("checkout.dnp")}</span>
                  </div>
                  <div>{t("checkout.tarif")}</div>
                </div>
                <div className={styles.sel_del_a}>
                  <img src={circleAImg} alt="circle" />
                  <div className={styles.sel_a_info}>
                    <div>
                      <div>{t("checkout.urk")}</div>
                      <div>{t("checkout.dnp1")}</div>
                    </div>
                    <div style={{ position: "relative" }}>
                      <button
                        onClick={() => {
                          setShowUkr(!showUkr);
                        }}
                        style={{
                          borderBottomLeftRadius: showUkr ? "0px" : "10px",
                          borderBottomRightRadius: showUkr ? "0px" : "10px",
                        }}
                      >
                        {ukrSelected ? (
                          <div>{ukrSelected}</div>
                        ) : (
                          <div>{t("checkout.dnpo")}</div>
                        )}
                        <img src={arrImg} alt="arrow" width={15} />
                      </button>
                      <div
                        className={`${styles.selector2} ${
                          showUkr ? styles.active : ""
                        }`}
                      >
                        <input
                          type="text"
                          placeholder={t("checkout.search2")}
                          onChange={(e) => {
                            setUkrSelected(e.target.value);
                            dispatch({
                              type: "update",
                              payload: { ukr: e.target.value },
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.tarif}>
                    <div>{t("checkout.tarif")}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div>
          <h2>{t("checkout.buy")}</h2>
          <div className={styles.select_pay}>
            <div
              className={`${
                state.showPay === "receiving" ? styles.active : ""
              }`}
              style={{ height: state.showPay === "receiving" ? "" : "71.12px" }}
              onClick={() =>
                dispatch({ type: "update", payload: { showPay: "receiving" } })
              }
            >
              {state.showPay === "receiving" ? (
                <img src={circleAImg} alt="circle" />
              ) : (
                <img
                  src={circleImg}
                  alt="circle"
                  style={{ marginLeft: "5px" }}
                />
              )}
              <span>{t("checkout.take")}</span>
            </div>
            <div
              className={`${
                state.showPay === "subscription" ? styles.active : ""
              }`}
              style={{
                height: state.showPay === "subscription" ? "" : "71.12px",
              }}
              onClick={() =>
                dispatch({
                  type: "update",
                  payload: { showPay: "subscription" },
                })
              }
            >
              {state.showPay === "subscription" ? (
                <img src={circleAImg} alt="circle" />
              ) : (
                <img
                  src={circleImg}
                  alt="circle"
                  style={{ marginLeft: "5px" }}
                />
              )}
              <span>{t("checkout.prebuy")}</span>
            </div>
          </div>
        </div>
        <div className={styles.order_last}>
          <label htmlFor="comment">{t("checkout.comment")}</label>
          <textarea
            name="comment"
            placeholder={t("checkout.comment")}
            value={state.comment}
            onChange={(e) =>
              dispatch({ type: "update", payload: { comment: e.target.value } })
            }
          ></textarea>
        </div>
      </div>
      <aside className={styles.aside}>
        <h1>{t("checkout.all")}</h1>
        <div>
          <div className={styles.block_info}>
            <div>
              {cart?.data?.length} {t("checkout.prodsum")}
            </div>
            <CurrencyConverter amount={cart?.totalPrice} exchangeRates={curr} />
          </div>
          <div className={styles.block_info}>
            <div>{t("checkout.sum")}</div>
            <div style={{ maxWidth: "120px", textAlign: "end" }}>
              {t("checkout.tarif")}
            </div>
          </div>
          <div className={styles.block_info}>
            <div>{t("checkout.buyall")}</div>
            <CurrencyConverter
              style={{ color: "#000", fontSize: "30px" }}
              amount={cart?.totalPrice}
              exchangeRates={curr}
            />
          </div>
          <button
            className={styles.send_order}
            onClick={onOrder}
            disabled={cart?.data?.length < 1}
          >
            {t("checkout.succ")}
          </button>
        </div>
        <div className={styles.order_list}>
          <div>{t("checkout.succdesc")}</div>
          <ul>
            <li>
              <Link to="/order-info">{t("checkout.delivdesc")}</Link>
            </li>
            <li>
              <Link to="/privacy">{t("checkout.privacy")}</Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
