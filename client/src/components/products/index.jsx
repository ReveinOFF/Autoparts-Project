import styles from "./products.module.css";
import favAImg from "../../assets/images/profile/fav_a.svg";
import favImg from "../../assets/images/profile/fav.svg";
import recallImg from "../../assets/images/profile/recall.svg";
import cartImg from "../../assets/images/profile/prod_cart.svg";
import { Link } from "react-router-dom";
import delImg from "../../assets/images/profile/deliver.svg";
import starImg from "../../assets/images/profile/star.svg";
import starAImg from "../../assets/images/profile/star_a.svg";
import Image from "../image/image";

export default function ProductsComponent({
  data,
  removeFav,
  addFav,
  addToCart,
}) {
  return (
    <div className={styles.block}>
      {data?.length > 0 &&
        data?.map((item) => (
          <div className={styles.product}>
            <div className={styles.sect}>
              {item.isFav ? (
                <img
                  src={favAImg}
                  alt="favorite"
                  onClick={() => removeFav(item._id)}
                />
              ) : (
                <img
                  src={favImg}
                  alt="favorite"
                  onClick={() => addFav(item._id)}
                />
              )}
            </div>
            <Image
              src={
                item?.image[0]?.length > 3
                  ? `${process.env.REACT_APP_IMG}${item.image[0]}`
                  : ""
              }
            />
            <div className={styles.info}>
              <div className={styles.inf_b}>
                <div>
                  <Link to={`/product/${item._id}`} className={styles.name}>
                    {item.title}
                  </Link>
                  <div className={styles.raiting}>
                    <div>
                      {Array.from({ length: 5 }, (_, index) => {
                        if (index < item.rating) {
                          return <img key={index} src={starAImg} alt="star" />;
                        } else {
                          return <img key={index} src={starImg} alt="star" />;
                        }
                      })}
                    </div>
                    <div>
                      <img src={recallImg} alt="recall" />
                      <span>{item.reviewsCount}</span>
                    </div>
                  </div>
                  <div className={styles.price}>{item.price} $</div>
                </div>
                <img
                  src={cartImg}
                  alt="cart"
                  onClick={() =>
                    addToCart({
                      _id: item._id,
                      image: item.image[0],
                      title: item.title,
                      price: item.price,
                    })
                  }
                />
              </div>
              <div className={styles.delivery}>
                <span>Готовий до відправки</span>
                <img src={delImg} alt="delivery" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
