export const updateFavData = (newData) => {
  const existingData = getFavData();
  const updatedData = [...existingData, newData];
  localStorage.setItem("fav", JSON.stringify(updatedData));

  return updatedData;
};

export const removeFavItem = (itemId) => {
  const existingData = getFavData();
  const updatedData = existingData.filter((item) => item.id !== itemId);
  localStorage.setItem("fav", JSON.stringify(updatedData));

  return updatedData;
};

export const isFavEmpty = () => {
  const cartData = getFavData();
  return cartData.length === 0;
};

export const getFavData = () => {
  const cartData = localStorage.getItem("fav");
  return cartData ? JSON.parse(cartData) : [];
};
