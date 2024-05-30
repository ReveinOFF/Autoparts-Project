import styles from "./product.module.css";
import arrowPage from "../../assets/images/main/arrow_page.svg";
import Image from "../../components/image/image";
import starImg from "../../assets/images/product/star.svg";
import starAImg from "../../assets/images/product/starA.svg";
import cartImg from "../../assets/images/product/cart.svg";
import favImg from "../../assets/images/product/favorite.svg";
import favAImg from "../../assets/images/product/favoriteA.svg";
import cardImg from "../../assets/images/product/card.svg";
import mcImg from "../../assets/images/product/mc.png";
import vcImg from "../../assets/images/product/vc.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ConvertJsonToHtml from "../../utils/rich-html";
import { updateCartData } from "../../utils/cart";
import { isSaved, removeFavItem, updateFavData } from "../../utils/fovourite";
import { useDispatch, useSelector } from "react-redux";
import Cart from "../../components/cart";
import { SET_CART } from "../../reducers/cartReducer";
import CurrencyConverter from "../../components/currencyConverter";

export default function Product() {
  const { isAuth } = useSelector((s) => s.auth);
  const [searchParams] = useSearchParams();
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const [imgSelected, setImgSelected] = useState();
  const [showCart, setShowCart] = useState(false);
  const [type, setType] = useState(1);
  const { id } = useParams();
  const [curr, setCurr] = useState([]);

  const getProduct = async () => {
    if (isAuth) {
      const token = localStorage.getItem("token");

      const data = jwtDecode(token);

      const res = await axios.get(
        `${process.env.REACT_APP_HOST}/product/get-product/${id}/${data._id}`
      );

      setData(res.data);
      setImgSelected(res.data.image[0]);
    } else {
      const res = await axios.get(
        `${process.env.REACT_APP_HOST}/product/get-product/${id}`
      );
      let tempData = res.data;

      if (isSaved(res?.data?.id)) tempData.isFav = true;
      else tempData.isFav = false;

      setData(tempData);
      setImgSelected(tempData.image[0]);
    }
  };

  useEffect(() => {
    const GetCurr = async () => {
      const res = await axios.get(`${process.env.REACT_APP_HOST}/currency`);

      setCurr(res.data);
    };

    GetCurr();
  }, []);

  useEffect(() => {
    getProduct();
  }, []);

  const addToCart = () => {
    updateCartData({
      id: data?._id,
      image: data?.image[0],
      title: data?.title,
      count: 1,
      price: data?.price,
      mainPrice: data?.price,
    });
    setShowCart(true);
    dispatch({ type: SET_CART });
  };

  const addToFav = async () => {
    updateFavData(data?._id);
    setData((prev) => ({ ...prev, isFav: true }));

    if (isAuth) {
      const token = localStorage.getItem("token");

      const { _id } = jwtDecode(token);

      await axios.post(`${process.env.REACT_APP_HOST}/authentication/fav/add`, {
        _id: _id,
        saveProductId: id,
      });
    }
  };

  const remToFav = async () => {
    removeFavItem(data?._id);
    setData((prev) => ({ ...prev, isFav: false }));

    if (isAuth) {
      const token = localStorage.getItem("token");

      const { _id } = jwtDecode(token);

      await axios.delete(
        `${process.env.REACT_APP_HOST}/authentication/fav/del/${_id}/${data?._id}`
      );
    }
  };

  return (
    <div className="container" style={{ marginBottom: 60 }}>
      {showCart && (
        <div className="cart_modal">
          <Cart onClose={() => setShowCart(false)} />
        </div>
      )}
      <div className="pages">
        {searchParams
          ?.get("pages")
          ?.split("/")
          ?.map((item, index, array) => (
            <>
              <div key={index}>{item}</div>
              {index !== array.length - 1 && (
                <img
                  key={`arrow-${index}`}
                  src={arrowPage}
                  alt="arrow page"
                  width={10}
                />
              )}
            </>
          ))}
        <img key={`arrow`} src={arrowPage} alt="arrow page" width={10} />
        <div>{data?.title}</div>
      </div>
      <div>
        <div className={styles.product}>
          <div>
            {data?.image?.filter((item) => item !== imgSelected).length > 0 && (
              <div>
                {data?.image
                  ?.filter((item) => item !== imgSelected)
                  ?.map((item) => (
                    <Image src={`${process.env.REACT_APP_IMG}${item}`} />
                  ))}
              </div>
            )}
            <Image
              style={{
                gridColumn:
                  data?.image?.filter((item) => item !== imgSelected).length > 0
                    ? ""
                    : "1 / 3",
              }}
              src={
                imgSelected ? `${process.env.REACT_APP_IMG}${imgSelected}` : ""
              }
            />
          </div>
          <div className={styles.product_d}>
            <h1>{data?.title}</h1>
            <div className={styles.recall}>
              <div>
                {Array.from({ length: 5 }, (_, index) => {
                  if (index < data?.rating) {
                    return (
                      <img key={index} src={starAImg} alt="star" width={20} />
                    );
                  } else {
                    return (
                      <img key={index} src={starImg} alt="star" width={20} />
                    );
                  }
                })}
              </div>
              <div>{data?.reviewsCount} відгуків</div>
            </div>
            <CurrencyConverter
              className={styles.price}
              amount={data?.price}
              exchangeRates={curr}
            />
            <div className={styles.btns}>
              <button onClick={() => addToCart()}>
                <img src={cartImg} alt="cart" />
                <span>Додати у кошик</span>
              </button>
              {data?.isFav ? (
                <button onClick={remToFav}>
                  <img src={favAImg} alt="favorite" />
                </button>
              ) : (
                <button onClick={addToFav}>
                  <img src={favImg} alt="favorite" />
                </button>
              )}
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
            <div
              className={type === 1 ? styles.active : ""}
              onClick={() => setType(1)}
            >
              Опис
            </div>
            <div
              className={type === 2 ? styles.active : ""}
              onClick={() => setType(2)}
            >
              Характеристика
            </div>
            <div
              className={type === 3 ? styles.active : ""}
              onClick={() => setType(3)}
            >
              Відгуки
            </div>
          </div>
          <div>
            {type === 1 ? (
              data?.description ? (
                <>
                  {typeof data?.description !== "string" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: ConvertJsonToHtml(
                          JSON.parse(data?.description)
                        ),
                      }}
                    ></div>
                  ) : (
                    <div>{data?.description}</div>
                  )}
                </>
              ) : (
                ""
              )
            ) : type === 2 ? (
              data?.characteristics ? (
                <>
                  {typeof data?.characteristics !== "string" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: ConvertJsonToHtml(
                          JSON.parse(data?.characteristics)
                        ),
                      }}
                    ></div>
                  ) : (
                    <div>{data?.characteristics}</div>
                  )}
                </>
              ) : (
                ""
              )
            ) : (
              <div className={styles.reviews}>
                {data?.reviews?.map((item) => (
                  <div className={styles.review}>
                    <div className={styles.rev_inf}>
                      <Image />
                      <div className={styles.rev_usr}>
                        <div>{item.user?.name}</div>
                        <div>{item.message}</div>
                      </div>
                    </div>
                    <div className={styles.star}>
                      <div>
                        {Array.from({ length: 5 }, (_, index) => {
                          if (index < item?.star) {
                            return (
                              <img
                                key={index}
                                src={starAImg}
                                alt="star"
                                width={20}
                              />
                            );
                          } else {
                            return (
                              <img
                                key={index}
                                src={starImg}
                                alt="star"
                                width={20}
                              />
                            );
                          }
                        })}
                      </div>
                      <div>Дуже гарно</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
