import { NavLink, Outlet, useLocation } from "react-router-dom";
import styles from "./leftLayout.module.css";
import logoImg from "../../../assets/images/header/logo.svg";

export default function LeftLayout() {
  const location = useLocation();

  return (
    <div className={styles.ly}>
      <div className={styles.left_modal}>
        <nav>
          <NavLink
            to="/admin/edit/home"
            className={
              location.pathname === "/admin/edit/home" ? styles.active : null
            }
          >
            Головна
          </NavLink>
          <NavLink
            to="/admin/edit/category"
            className={
              location.pathname === "/admin/edit/category"
                ? styles.active
                : null
            }
          >
            Категорії
          </NavLink>
          <NavLink
            to="/admin/edit/products"
            className={
              location.pathname === "/admin/edit/products"
                ? styles.active
                : null
            }
          >
            Товари
          </NavLink>
          <NavLink
            to="/admin/edit/lang"
            className={
              location.pathname === "/admin/edit/lang" ? styles.active : null
            }
          >
            Мова
          </NavLink>
          <NavLink
            to="/admin/edit/mark"
            className={
              location.pathname === "/admin/edit/mark" ? styles.active : null
            }
          >
            Марка, модель
          </NavLink>
          <NavLink
            to="/admin/edit/pages"
            className={
              location.pathname === "/admin/edit/pages" ? styles.active : null
            }
          >
            Сторінки
          </NavLink>
          <NavLink
            to="/admin/edit/exp"
            className={
              location.pathname === "/admin/edit/exp" ? styles.active : null
            }
          >
            Єкспорт/Імпорт
          </NavLink>
          <NavLink
            to="/admin/edit/curr"
            className={
              location.pathname === "/admin/edit/curr" ? styles.active : null
            }
          >
            Валюта
          </NavLink>
          <NavLink
            to="/admin/edit/setting"
            className={
              location.pathname === "/admin/edit/setting" ? styles.active : null
            }
          >
            Налаштування
          </NavLink>
        </nav>
        <img src={logoImg} alt="logo" width={300} />
      </div>
      <Outlet />
    </div>
  );
}
