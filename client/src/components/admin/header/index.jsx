import styles from "./header.module.css";
import homeImg from "../../../assets/images/auth/home.svg";
import { Link } from "react-router-dom";

export default function AdminHeader() {
  return (
    <header className={`${styles.header} flex-between`}>
      <div>Панель Адміністратора</div>
      <Link to="/" className="flex-full">
        <img src={homeImg} alt="home" width={25} height={25} />
        <div>Повернутись до сайту</div>
      </Link>
    </header>
  );
}
