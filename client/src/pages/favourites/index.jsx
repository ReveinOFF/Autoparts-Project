import emptyImg from "../../assets/images/profile/empty.png";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { getFavData, isFavEmpty, removeFavItem } from "../../utils/fovourite";
import ProductsComponent from "../../components/products";
import Cart from "../../components/cart";
import { useDispatch } from "react-redux";
import { SET_CART } from "../../reducers/cartReducer";
import { updateCartData } from "../../utils/cart";
import { useTranslation } from "react-i18next";

export default function Favourites() {
  const [data, setData] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const getProducts = async () => {
    const isEmpty = isFavEmpty();
    if (isEmpty) return;

    const fav = getFavData();
    const res = await axios.post(
      `${process.env.REACT_APP_HOST}/product/get-product-ids`,
      fav
    );
    const dataWithFav = res?.data?.map((item) => ({
      ...item,
      isFav: true,
    }));
    setData(dataWithFav || []);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const removeFav = async (id) => {
    removeFavItem(id);
    setData(data.filter((item) => item._id !== id));
  };

  const addToCart = (data) => {
    updateCartData({
      id: data?._id,
      image: data?.image,
      title: data?.title,
      count: 1,
      price: data?.price,
      mainPrice: data?.price,
    });
    setShowCart(true);
    dispatch({ type: SET_CART });
  };

  return (
    <>
      {showCart && (
        <div className="cart_modal">
          <Cart onClose={() => setShowCart(false)} />
        </div>
      )}
      <div className="container" style={{ paddingBottom: 60 }}>
        <h1 className="h1_border">{t("fav.h1")}</h1>
        <ProductsComponent
          data={data}
          addToCart={addToCart}
          removeFav={removeFav}
        />
        {(!data || data?.length < 1) && (
          <div className="profile_empty">
            <img src={emptyImg} alt="empty" style={{ width: "30%" }} />
            <div>{t("fav.div1")}</div>
            <div>{t("fav.div2")}</div>
          </div>
        )}
      </div>
    </>
  );
}
