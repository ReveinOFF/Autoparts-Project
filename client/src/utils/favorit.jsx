export const updateFavoritData = (newData) => {
  const existingData = getFavoritData();
  const updatedData = [...existingData, newData];
  localStorage.setItem("cart", JSON.stringify(updatedData));

  return updatedData;
};

export const removeFavoritItem = (itemId) => {
  const existingData = getFavoritData();
  const updatedData = existingData.filter((item) => item.id !== itemId);
  localStorage.setItem("cart", JSON.stringify(updatedData));

  return updatedData;
};

export const isFavoritEmpty = () => {
  const favoritData = getFavoritData();
  return favoritData.length === 0;
};

export const getFavoritData = () => {
  const favoritData = localStorage.getItem("cart");
  return favoritData ? JSON.parse(favoritData) : [];
};
