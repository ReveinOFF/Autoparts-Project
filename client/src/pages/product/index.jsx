import styles from "./product.module.css";
import arrowPage from "../../assets/images/main/arrow_page.svg";
import Image from "../../components/image/image";
import starImg from "../../assets/images/product/star.svg";
import cartImg from "../../assets/images/product/cart.svg";
import favImg from "../../assets/images/product/favorite.svg";
import cardImg from "../../assets/images/product/card.svg";
import mcImg from "../../assets/images/product/mc.png";
import vcImg from "../../assets/images/product/vc.png";
import { useState } from "react";

export default function Product() {
  const [data, setData] = useState();
  const [imgSelected, setImgSelected] = useState();
  const [type, setType] = useState(1);

  return (
    <div className="container" style={{ marginBottom: 60 }}>
      <div className="pages">
        <a href="/">Audi</a>
        <img src={arrowPage} alt="arrow page" width={10} />
        <a href="/">A6</a>
        <img src={arrowPage} alt="arrow page" width={10} />
        <a href="/">Зовнішні елементи</a>
        <img src={arrowPage} alt="arrow page" width={10} />
        <a href="/">Капот</a>
        <img src={arrowPage} alt="arrow page" width={10} />
        <div href="/">Капот Audi A6</div>
      </div>
      <div>
        <div className={styles.product}>
          <div>
            <div>
              <Image />
              <Image />
              <Image />
              <Image />
            </div>
            <Image
              src={
                data?.image[0]
                  ? `${process.env.REACT_APP_IMG}${data?.image[0]}`
                  : ""
              }
            />
          </div>
          <div className={styles.product_d}>
            <h1>Капот Audi A6</h1>
            <div className={styles.recall}>
              <div>
                <img src={starImg} alt="star" />
                <img src={starImg} alt="star" />
                <img src={starImg} alt="star" />
                <img src={starImg} alt="star" />
                <img src={starImg} alt="star" />
              </div>
              <div>0 відгуков</div>
            </div>
            <div className={styles.price}>0.00 $</div>
            <div className={styles.btns}>
              <button>
                <img src={cartImg} alt="cart" />
                <span>Додати у кошик</span>
              </button>
              <button>
                <img src={favImg} alt="favorite" />
              </button>
            </div>
            <div className={styles.card}>
              <div>
                <img src={cardImg} alt="card" width={40} />
              </div>
              <div>
                <div>
                  Оплата готівкою, картою, на розрахунковий рахунок або онлайн
                  за допомогою Visa/Mastercard
                </div>
                <div>
                  <img src={mcImg} alt="master card" width={70} height={30} />
                  <img src={vcImg} alt="visa card" width={50} height={30} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.information}>
          <div>
            <div className={type === 1 ? styles.active : ""}>Опис</div>
            <div className={type === 2 ? styles.active : ""}>
              Характеристика
            </div>
            <div className={type === 3 ? styles.active : ""}>Відгуки</div>
          </div>
          <div>Lorem ipsum dolor sit amet ...</div>
        </div>
      </div>
    </div>
  );
}
