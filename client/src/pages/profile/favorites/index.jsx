import emptyImg from "../../../assets/images/profile/empty.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { DATA_USER_ACTION } from "../../../reducers/profileReducer";
import { useState } from "react";
import Cart from "../../../components/cart";
import { updateCartData } from "../../../utils/cart";
import { SET_CART } from "../../../reducers/cartReducer";
import ProductsComponent from "../../../components/products";

export default function FavoritesP() {
  const state = useSelector((s) => s.profile);
  const [showCart, setShowCart] = useState(false);
  const dispatch = useDispatch();

  const removeFav = async (id) => {
    await axios.delete(
      `${process.env.REACT_APP_HOST}/authentication/fav/del/${state._id}/${id}`
    );

    dispatch({
      type: DATA_USER_ACTION,
      payload: {
        savedProducts: state.savedProducts.filter((f) => f._id !== id),
      },
    });
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
      <h1>Список бажань</h1>
      <ProductsComponent
        data={state?.savedProducts}
        removeFav={removeFav}
        addToCart={addToCart}
      />
      {(!state?.savedProducts || state?.savedProducts?.length < 1) && (
        <div className="profile_empty">
          <img src={emptyImg} alt="empty" />
          <div>Ваш список бажань пустий</div>
          <div>Наповніть його товарами</div>
        </div>
      )}
    </>
  );
}
