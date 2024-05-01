import { Link } from "react-router-dom";
import footerImg from "../../assets/images/footer/footer.svg";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer>
      <div className={`container ${styles.footer_block}`}>
        <Link to="/">
          <img src={footerImg} alt="logo" width={350} height={120} />
        </Link>
        <div>
          <div className={styles.f_title}>Інформація</div>
          <div className={styles.f_nav}>
            <Link to="/about">Про нас</Link>
            <Link to="/information">Інформація про доставку</Link>
            <Link to="/privacy">Політика конфіденційності</Link>
          </div>
        </div>
        <div>
          <div className={styles.f_title}>Підтримка</div>
          <div className={styles.f_nav}>
            <Link to="/contact">Контакти</Link>
            <Link to="/">Повернення товару</Link>
            <Link to="/">Карта сайту</Link>
          </div>
        </div>
        <div>
          <div className={styles.f_title}>Особистий кабінет</div>
          <div className={styles.f_nav}>
            <Link to="/profile">Особистий кабінет</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
