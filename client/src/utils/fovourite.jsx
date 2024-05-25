export const updateFavData = (newData) => {
  const existingData = getFavData();
  const updatedData = [...existingData, newData];
  localStorage.setItem("fav", JSON.stringify(updatedData));

  return updatedData;
};

export const removeFavItem = (itemId) => {
  const existingData = getFavData();
  const updatedData = existingData.filter((item) => item !== itemId);
  localStorage.setItem("fav", JSON.stringify(updatedData));

  return updatedData;
};

export const isFavEmpty = () => {
  const favData = getFavData();
  return favData.length === 0;
};

export const isSaved = (id) => {
  const favData = getFavData();
  return favData.includes(id);
};

export const getFavData = () => {
  const favData = localStorage.getItem("fav");
  return favData ? JSON.parse(favData) : [];
};
