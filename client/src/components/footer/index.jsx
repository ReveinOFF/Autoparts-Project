import { Link } from "react-router-dom";
import footerImg from "../../assets/images/footer/footer.svg";
import styles from "./footer.module.css";
import { useSelector } from "react-redux";

export default function Footer() {
  const { isAuth } = useSelector((s) => s.auth);

  return (
    <footer>
      <div className={`container ${styles.footer_block}`}>
        <Link to="/">
          <img src={footerImg} alt="logo" />
        </Link>
        <div>
          <div>
            <div className={styles.f_title}>Інформація</div>
            <div className={styles.f_nav}>
              <Link to="/about">Про нас</Link>
              <Link to="/order-info">Інформація про доставку</Link>
              <Link to="/privacy">Політика конфіденційності</Link>
            </div>
          </div>
          <div>
            <div className={styles.f_title}>Підтримка</div>
            <div className={styles.f_nav}>
              <Link to="/contact">Контакти</Link>
              <Link to="/return-goods">Повернення товару</Link>
              <Link to="/map">Карта сайту</Link>
            </div>
          </div>
          <div>
            <div className={styles.f_title}>Особистий кабінет</div>
            <div className={styles.f_nav}>
              {isAuth ? (
                <>
                  <Link to="/profile">Особистий кабінет</Link>
                </>
              ) : (
                <Link to="/login">Увійти/Створити кабінет</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
