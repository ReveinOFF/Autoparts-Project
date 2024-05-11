import Image from "../../components/image/image";
import deliverySvg from "../../assets/images/delivery.svg";
import cartSvg from "../../assets/images/cart.png";
import styles from "./favourites.module.css";

export default function Favourites() {
  return (
    <>
      <div className="container">
        <h1 className="h1_border">Обрані товари</h1>
        <div className={styles.favourites_block}>
          <div className={styles.favourite}>
            <Image />
            <div className={styles.name}>Капот Audi A6</div>
            <div className={styles.star}>* * * *</div>
            <div className={`${styles.block_price} flex-between`}>
              <div className={styles.price}>35 500$</div>
              <img src={cartSvg} alt="cart" />
            </div>
            <div className={`${styles.delivery} flex-align`}>
              <span>Готовий до відправки</span>
              <img src={deliverySvg} alt="delivery" />
            </div>
          </div>
          <div className={styles.favourite}>
            <Image />
            <div className={styles.name}>Капот Audi A6</div>
            <div className={styles.star}>* * * *</div>
            <div className={`${styles.block_price} flex-between`}>
              <div className={styles.price}>35 500$</div>
              <img src={cartSvg} alt="cart" />
            </div>
            <div className={`${styles.delivery} flex-align`}>
              <span>Готовий до відправки</span>
              <img src={deliverySvg} alt="delivery" />
            </div>
          </div>
          <div className={styles.favourite}>
            <Image />
            <div className={styles.name}>Капот Audi A6</div>
            <div className={styles.star}>* * * *</div>
            <div className={`${styles.block_price} flex-between`}>
              <div className={styles.price}>35 500$</div>
              <img src={cartSvg} alt="cart" />
            </div>
            <div className={`${styles.delivery} flex-align`}>
              <span>Готовий до відправки</span>
              <img src={deliverySvg} alt="delivery" />
            </div>
          </div>
          <div className={styles.favourite}>
            <Image />
            <div className={styles.name}>Капот Audi A6</div>
            <div className={styles.star}>* * * *</div>
            <div className={`${styles.block_price} flex-between`}>
              <div className={styles.price}>35 500$</div>
              <img src={cartSvg} alt="cart" />
            </div>
            <div className={`${styles.delivery} flex-align`}>
              <span>Готовий до відправки</span>
              <img src={deliverySvg} alt="delivery" />
            </div>
          </div>
          <div className={styles.favourite}>
            <Image />
            <div className={styles.name}>Капот Audi A6</div>
            <div className={styles.star}>* * * *</div>
            <div className={`${styles.block_price} flex-between`}>
              <div className={styles.price}>35 500$</div>
              <img src={cartSvg} alt="cart" />
            </div>
            <div className={`${styles.delivery} flex-align`}>
              <span>Готовий до відправки</span>
              <img src={deliverySvg} alt="delivery" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
