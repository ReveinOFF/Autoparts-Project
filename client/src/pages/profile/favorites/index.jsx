import Image from "../../../components/image/image";
import delImg from "../../../assets/images/profile/deliver.svg";
import cartImg from "../../../assets/images/profile/prod_cart.svg";
import recallImg from "../../../assets/images/profile/recall.svg";
import starImg from "../../../assets/images/profile/star.svg";
import starAImg from "../../../assets/images/profile/star_a.svg";
import favAImg from "../../../assets/images/profile/fav_a.svg";
import circleImg from "../../../assets/images/profile/circle.svg";
import styles from "./favorites.module.css";

export default function FavoritesP() {
  return (
    <>
      <h1>Список бажань</h1>
      <div className={styles.block}>
        <div className={styles.product}>
          <div className={styles.sect}>
            <img src={favAImg} alt="favorite" />
            <img src={circleImg} alt="circle" />
          </div>
          <Image />
          <div className={styles.info}>
            <div className={styles.inf_b}>
              <div>
                <div className={styles.name}>Капот Audi A6</div>
                <div className={styles.raiting}>
                  <div>
                    <img src={starAImg} alt="star" />
                    <img src={starAImg} alt="star" />
                    <img src={starImg} alt="star" />
                    <img src={starImg} alt="star" />
                    <img src={starImg} alt="star" />
                  </div>
                  <div>
                    <img src={recallImg} alt="recall" />
                    <span>2</span>
                  </div>
                </div>
                <div className={styles.price}>35 500 $</div>
              </div>
              <img src={cartImg} alt="cart" />
            </div>
            <div className={styles.delivery}>
              <span>Готовий до відправки</span>
              <img src={delImg} alt="delivery" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
