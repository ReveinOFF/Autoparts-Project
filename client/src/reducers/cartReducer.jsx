import { getCartStorage } from "../utils/cart";

export const SET_CART = "SET_CART_ACTION";

const { count, totalPrice } = getCartStorage();

const initialState = {
  count: count || 0,
  totalPrice: totalPrice || 0,
};

const CartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CART:
      return {
        ...getCartStorage(),
      };
    default:
      return state;
  }
};

export default CartReducer;
