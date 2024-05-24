import Image from "../../../components/image/image";
import delImg from "../../../assets/images/profile/deliver.svg";
import cartImg from "../../../assets/images/profile/prod_cart.svg";
import recallImg from "../../../assets/images/profile/recall.svg";
import starImg from "../../../assets/images/profile/star.svg";
import starAImg from "../../../assets/images/profile/star_a.svg";
import favAImg from "../../../assets/images/profile/fav_a.svg";
import circleImg from "../../../assets/images/profile/circle.svg";
import emptyImg from "../../../assets/images/profile/empty.png";
import styles from "./favorites.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { DATA_USER_ACTION } from "../../../reducers/profileReducer";

export default function FavoritesP() {
  const state = useSelector((s) => s.profile);
  const dispatch = useDispatch();

  const removeFav = async (id) => {
    await axios.delete(
      `${process.env.REACT_APP_HOST}/authentication/fav/del/${id}`
    );
    dispatch({
      type: DATA_USER_ACTION,
      payloda: {
        saveProductIds: state?.saveProductIds.filter((f) => f !== id) || [],
      },
    });
  };

  return (
    <>
      <h1>Список бажань</h1>
      <div className={styles.block}>
        {state?.savedProducts?.length > 0 ? (
          state.savedProducts.map((item) => (
            <div className={styles.product}>
              <div className={styles.sect}>
                <img src={favAImg} alt="favorite" />
                <img src={circleImg} alt="circle" />
              </div>
              <Image
                src={
                  item.image[0]?.length > 3
                    ? `${process.env.REACT_APP_IMG}${item.image[0]}`
                    : ""
                }
              />
              <div className={styles.info}>
                <div className={styles.inf_b}>
                  <div>
                    <Link
                      to={`/product/id=${item._id}`}
                      className={styles.name}
                    >
                      {item.title}
                    </Link>
                    <div className={styles.raiting}>
                      <div>
                        {Array.from({ length: 5 }, (_, index) => {
                          if (index < item.rating) {
                            return (
                              <img key={index} src={starAImg} alt="star" />
                            );
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
                    onClick={() => removeFav(item._id)}
                  />
                </div>
                <div className={styles.delivery}>
                  <span>Готовий до відправки</span>
                  <img src={delImg} alt="delivery" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="profile_empty">
            <img src={emptyImg} alt="empty" />
            <div>Ваш список бажань пустий</div>
            <div>Наповніть його товарами</div>
          </div>
        )}
      </div>
    </>
  );
}
