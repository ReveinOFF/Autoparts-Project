import { NavLink, Outlet } from "react-router-dom";
import styles from "./leftLayout.module.css";
import logoImg from "../../../assets/images/header/logo.svg";

export default function LeftLayout() {
  return (
    <div className={styles.ly}>
      <div className={styles.left_modal}>
        <nav>
          <NavLink to="/admin/edit/home">Головна</NavLink>
          <NavLink to="/admin/edit/category">Категорії</NavLink>
          <NavLink to="/admin/edit/products">Товари</NavLink>
          <NavLink to="/admin/edit/lang">Мова</NavLink>
          <NavLink to="/admin/edit/exp">Єкспорт/Імпорт</NavLink>
          <NavLink to="/admin/edit/course">Валюта</NavLink>
          <NavLink to="/admin/edit/setting">Налаштування</NavLink>
        </nav>
        <img src={logoImg} alt="logo" width={300} />
      </div>
      <Outlet />
    </div>
  );
}
