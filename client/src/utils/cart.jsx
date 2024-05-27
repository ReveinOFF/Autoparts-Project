export const updateCartData = (newData) => {
  const existingData = getCartData();
  const updatedData = [...existingData, newData];
  localStorage.setItem("cart", JSON.stringify(updatedData));

  return updatedData;
};

export const setCartData = (newData) => {
  const updatedData = newData;
  localStorage.setItem("cart", JSON.stringify(updatedData));

  return updatedData;
};

export const removeCartItem = (itemId) => {
  const existingData = getCartData();
  const index = existingData.findIndex((item) => item.id === itemId);

  if (index !== -1) {
    existingData.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(existingData));

  return existingData;
};

export const removeCartAll = () => {
  localStorage.removeItem("cart");
};

export const isCartEmpty = () => {
  const cartData = getCartData();
  return cartData.length === 0;
};

export const getCartStorage = () => {
  const cartData = getCartData();
  return {
    count: cartData?.length || 0,
    totalPrice:
      cartData.reduce((sum, item) => sum + parseInt(item.price), 0) || 0,
  };
};

export const getCartData = () => {
  const cartData = localStorage.getItem("cart");
  return cartData ? JSON.parse(cartData) : [];
};

export const getCartDataWithTP = () => {
  const cartData = getCartData();
  return cartData
    ? {
        data: cartData,
        totalPrice:
          cartData?.reduce((sum, item) => sum + parseInt(item.price), 0) || 0,
      }
    : [];
};
