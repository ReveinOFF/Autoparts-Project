import { NavLink, Outlet, useLocation } from "react-router-dom";
import profileImg from "../../assets/images/profile/profile.svg";
import cartImg from "../../assets/images/profile/cart.svg";
import orderImg from "../../assets/images/profile/order.svg";
import favImg from "../../assets/images/profile/favorite.svg";
import recImg from "../../assets/images/profile/recall.svg";
import styles from "./pl.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { DATA_USER_ACTION } from "../../reducers/profileReducer";

export default function ProfileLayout() {
  const location = useLocation();
  const profile = useSelector((s) => s.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    const getProfile = async () => {
      const token = localStorage.getItem("token");

      const decode = jwtDecode(token);

      const res = await axios.get(
        `${process.env.REACT_APP_HOST}/authentication/profile/${decode._id}`
      );

      dispatch({ type: DATA_USER_ACTION, payload: res.data });
    };

    getProfile();
  }, []);

  return (
    <div className="container" style={{ display: "flex", marginBlock: 60 }}>
      <nav className={styles.nav}>
        <NavLink to="/profile" style={{ backgroundColor: "transparent" }}>
          <img
            src={profileImg}
            alt="profile"
            width={30}
            className={location.pathname === "/profile" ? styles.activeL : ""}
          />
          <div>
            <div>{`${profile?.name} ${profile?.surname}`}</div>
            <div>{profile?.login}</div>
          </div>
        </NavLink>
        <div className={styles.nav_list}>
          <NavLink
            to="/profile/orders"
            style={{ backgroundColor: "transparent" }}
            className={
              location.pathname === "/profile/orders" ? styles.activeL : ""
            }
          >
            <img src={orderImg} alt="order" width={30} />
            <span>Мої замовлення</span>
          </NavLink>
          <NavLink to="/cart" style={{ backgroundColor: "transparent" }}>
            <img src={cartImg} alt="cart" width={30} />
            <span>Корзина</span>
          </NavLink>
          <NavLink
            to="/profile/favourites"
            style={{ backgroundColor: "transparent" }}
            className={
              location.pathname === "/profile/favourites" ? styles.activeL : ""
            }
          >
            <img src={favImg} alt="favourites" width={30} />
            <span>Списки бажань</span>
          </NavLink>
          <NavLink
            to="/profile/recall"
            style={{ backgroundColor: "transparent" }}
            className={
              location.pathname === "/profile/recall" ? styles.activeL : ""
            }
          >
            <img src={recImg} alt="recall" width={30} />
            <span>Мої відгуки</span>
          </NavLink>
        </div>
        <div></div>
      </nav>
      <div className={styles.profile}>
        <Outlet />
      </div>
    </div>
  );
}