import { Link } from "react-router-dom";
import footerImg from "../../assets/images/footer/footer.svg";
import styles from "./footer.module.css";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { isAuth } = useSelector((s) => s.auth);
  const { t } = useTranslation();

  return (
    <footer>
      <div className={`container ${styles.footer_block}`}>
        <Link to="/">
          <img src={footerImg} alt="logo" />
        </Link>
        <div>
          <div>
            <div className={styles.f_title}>{t("footer.title1")}</div>
            <div className={styles.f_nav}>
              <Link to="/about">{t("footer.about")}</Link>
              <Link to="/order-info">{t("footer.ord-inf")}</Link>
              <Link to="/privacy">{t("footer.privacy")}</Link>
            </div>
          </div>
          <div>
            <div className={styles.f_title}>{t("footer.title2")}</div>
            <div className={styles.f_nav}>
              <Link to="/contact">{t("footer.contact")}</Link>
              <Link to="/return-goods">{t("footer.ret-ord")}</Link>
            </div>
          </div>
          <div>
            <div className={styles.f_title}>{t("footer.title3")}</div>
            <div className={styles.f_nav}>
              {isAuth ? (
                <>
                  <Link to="/profile">{t("footer.profile")}</Link>
                </>
              ) : (
                <Link to="/login">{t("footer.log")}</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
