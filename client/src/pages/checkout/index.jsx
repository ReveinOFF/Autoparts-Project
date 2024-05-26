import { Link } from "react-router-dom";
import styles from "./checkout.module.css";
import infoImg from "../../assets/images/contact/info.svg";
import mapImg from "../../assets/images/map.svg";
import arrImg from "../../assets/images/arrow.svg";
import Image from "../../components/image/image";
import delImg from "../../assets/images/product/del.svg";
import circleImg from "../../assets/images/circle.svg";
import circleAImg from "../../assets/images/circleA.svg";
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { getCartDataWithTP, removeCartItem } from "../../utils/cart";
import { useDispatch } from "react-redux";
import { SET_CART } from "../../reducers/cartReducer";

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
  const [state, dispatch] = useReducer(reducer, {
    surname: "",
    name: "",
    mobOrEml: "",
    city: "",
    cart: [],
    showPoshta: "nova",
    showPay: "receiving",
    comment: "",
  });
  const [branches, setBranches] = useState([]);
  const [cart, setCart] = useState({});

  const onOrder = () => {};

  useEffect(() => {
    const res = getCartDataWithTP();
    setCart(res);
    dispatch({ type: "update", payload: { cart: res } });
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      const response = await axios.post(
        "https://api.novaposhta.ua/v2.0/json/",
        {
          apiKey: process.env.REACT_APP_NOVA_KEY,
          modelName: "AddressGeneral",
          calledMethod: "getWarehouses",
          methodProperties: {
            CityName: "Рівне",
          },
        }
      );

      setBranches(response.data.data);
    };

    fetchBranches();
  }, []);

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
        <h1>Оформлення замовлення</h1>
        <div>
          <h2>Ваші контактні дані</h2>
          <div>
            <div className={styles.input_top}>
              <fieldset className={styles.input_block}>
                <label htmlFor="surname">
                  Прізвище <img src={infoImg} alt="info" />
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
                  Ім`я <img src={infoImg} alt="info" />
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
                Мобільний телефон або ел. пошта <img src={infoImg} alt="info" />
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
                Місто <img src={infoImg} alt="info" />
              </label>
              <div className={styles.map_sel}>
                <button>
                  <div>
                    <img src={mapImg} alt="map" />
                    <div>
                      <div>Київ</div>
                      <div>Київ обл., Київ р-н</div>
                    </div>
                  </div>
                  <img src={arrImg} alt="arrow" width={15} />
                </button>
                <div></div>
              </div>
            </fieldset>
          </div>
        </div>
        <div>
          <h2>Замовлення</h2>
          <div className={styles.cart}>
            {cart?.data?.map((item) => (
              <div className={styles.cart_item}>
                <div>
                  <Image src={item.image?.length > 3 ? item.image : ""} />
                  <div>{item.title}</div>
                </div>
                <div>
                  <div>
                    {item.mainPrice} $ <span>x</span> {item.count} од.
                  </div>
                  <div>{item.price} $</div>
                  <img
                    src={delImg}
                    alt="delete"
                    onClick={() => removeCart(item.id)}
                  />
                </div>
              </div>
            ))}
            <div className={styles.cart_total}>
              <div>Всього:</div>
              <div>{cart?.totalPrice} $</div>
            </div>
          </div>
        </div>
        <div>
          <h2>Доставка</h2>
          <div className={styles.delivery}>
            {state?.showPoshta === "nova" ? (
              <>
                <div className={styles.sel_del_a}>
                  <img src={circleAImg} alt="circle" />
                  <div className={styles.sel_a_info}>
                    <div>
                      <div>Самовивіз з Нової Пошти</div>
                      <div>Середній термін доставки 2 дні</div>
                    </div>
                    <div>
                      <button>
                        <div>виберіть відповідне відділення</div>
                        <img src={arrImg} alt="arrow" width={15} />
                      </button>
                      <div></div>
                    </div>
                  </div>
                  <div className={styles.tarif}>
                    <div>за тарифами перевізника</div>
                    <div>
                      <img src={mapImg} alt="map" />
                      <span>Обрати на мапі</span>
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
                    <span>Самовивіз з Укр. Пошти</span>
                  </div>
                  <div>за тарифами перевізника</div>
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
                    <span>Самовивіз з Нової Пошти</span>
                  </div>
                  <div>за тарифами перевізника</div>
                </div>
                <div className={styles.sel_del_a}>
                  <img src={circleAImg} alt="circle" />
                  <div className={styles.sel_a_info}>
                    <div>
                      <div>Самовивіз з Укр. Пошти</div>
                      <div>Середній термін доставки 2 дні</div>
                    </div>
                    <div>
                      <button>
                        <div>виберіть відповідне відділення</div>
                        <img src={arrImg} alt="arrow" width={15} />
                      </button>
                      <div></div>
                    </div>
                  </div>
                  <div className={styles.tarif}>
                    <div>за тарифами перевізника</div>
                    <div>
                      <img src={mapImg} alt="map" />
                      <span>Обрати на мапі</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div>
          <h2>Оплата</h2>
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
              <span>При отриманні</span>
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
              <span>Передплата на картку продавця</span>
            </div>
          </div>
        </div>
        <div className={styles.order_last}>
          <label htmlFor="comment">Коментар до замовлення</label>
          <textarea
            name="comment"
            placeholder="Коментар до замовлення"
            value={state.comment}
            onChange={(e) =>
              dispatch({ type: "update", payload: { comment: e.target.value } })
            }
          ></textarea>
        </div>
      </div>
      <aside className={styles.aside}>
        <h1>Разом</h1>
        <div>
          <div className={styles.block_info}>
            <div>{cart?.data?.length} товар на суму</div>
            <div>{cart?.totalPrice} $</div>
          </div>
          <div className={styles.block_info}>
            <div>Вартість доставки</div>
            <div style={{ maxWidth: "120px", textAlign: "end" }}>
              за тарифами перевізника
            </div>
          </div>
          <div className={styles.block_info}>
            <div>До сплати</div>
            <div style={{ color: "#000", fontSize: "30px" }}>
              {cart?.totalPrice} $
            </div>
          </div>
          <button className={styles.send_order} onClick={onOrder}>
            Підтверджую замовлення
          </button>
        </div>
        <div className={styles.order_list}>
          <div>Підтверджуючи замовлення, я ознайомився та приймаю умови:</div>
          <ul>
            <li>
              <Link to="/order-info">інформація про доставку</Link>
            </li>
            <li>
              <Link to="/privacy">
                положення про обробку і захист персоналних даних
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
