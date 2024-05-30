import styles from "./cart.module.css";
import close from "../../assets/images/admin/ha_exit.svg";
import del from "../../assets/images//product/del.svg";
import { useEffect } from "react";
import { useState } from "react";
import Image from "../image/image";
import {
  getCartDataWithTP,
  removeCartItem,
  setCartData,
} from "../../utils/cart";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SET_CART } from "../../reducers/cartReducer";
import { useTranslation } from "react-i18next";

export default function Cart({ onClose, ...params }) {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setData(getCartDataWithTP());
  }, []);

  const minuseCount = (id) => {
    setData((prevState) => {
      const updatedData = prevState.data.map((item) => {
        if (item.id === id) {
          const count = item.count > 0 ? item.count - 1 : 0;
          return {
            ...item,
            count: count,
            price: item.mainPrice * count,
          };
        }
        return item;
      });

      const totalPrice = updatedData.reduce((sum, item) => sum + item.price, 0);

      return {
        totalPrice: totalPrice,
        data: updatedData,
      };
    });
  };

  const pluseCount = (id) => {
    setData((prevState) => {
      const updatedData = prevState.data.map((item) => {
        if (item.id === id) {
          const count = item.count + 1;
          return {
            ...item,
            count: count,
            price: item.mainPrice * count,
          };
        }
        return item;
      });

      const totalPrice = updatedData.reduce((sum, item) => sum + item.price, 0);

      return {
        totalPrice: totalPrice,
        data: updatedData,
      };
    });
  };

  const changeCount = (e, id) => {
    setData((prevState) => {
      const updatedData = prevState.data.map((item) => {
        if (item.id === id) {
          const count = e.target.value || 0;
          return {
            ...item,
            count: count,
            price: item.mainPrice * count,
          };
        }
        return item;
      });

      const totalPrice = updatedData.reduce((sum, item) => sum + item.price, 0);

      return {
        totalPrice: totalPrice,
        data: updatedData,
      };
    });
  };

  const checkout = () => {
    setCartData(data.data);
    navigate("/checkout");
    onClose();
  };

  const removeCart = (id) => {
    removeCartItem(id);
    setData((prev) => {
      const index = prev.data.findIndex((item) => item.id === id);
      if (index === -1) return prev;

      const updatedData = [...prev.data];
      updatedData.splice(index, 1);

      const totalPrice = updatedData.reduce((sum, item) => sum + item.price, 0);

      return {
        totalPrice: totalPrice,
        data: updatedData,
      };
    });
    dispatch({ type: SET_CART });
  };

  return (
    <div className={styles.cart} {...params}>
      <div className={styles.top}>
        <h2>{t("cart.h2")}</h2>
        <img src={close} alt="close" onClick={onClose} />
      </div>
      <div className={styles.bottom}>
        <div className={styles.block}>
          {data?.data?.length > 0
            ? data.data.map((item) => (
                <div className={styles.item}>
                  <Image
                    src={
                      item?.image?.length > 0
                        ? `${process.env.REACT_APP_IMG}${item.image}`
                        : ""
                    }
                  />
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.count}>
                    <span onClick={() => minuseCount(item.id)}>-</span>
                    <input
                      type="number"
                      onChange={(e) => changeCount(e, item.id)}
                      value={item.count}
                    />
                    <span onClick={() => pluseCount(item.id)}>+</span>
                  </div>
                  <div className={styles.inf}>
                    <img
                      src={del}
                      alt="delete"
                      onClick={() => removeCart(item.id)}
                    />
                    <div>{item.price} $</div>
                  </div>
                </div>
              ))
            : "Пусто"}
        </div>
        <div className={styles.btn}>
          <button onClick={onClose}>{t("cart.btn")}</button>
          <div>
            <div>{data?.totalPrice || 0}</div>
            <button onClick={() => checkout()}>{t("cart.btn")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
