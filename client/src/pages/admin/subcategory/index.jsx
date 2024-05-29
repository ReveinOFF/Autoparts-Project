import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminSubCategory() {
  const [data, setData] = useState([]);

  // const getCat = async () => {
  //   const res = await CategoriesHttp.getCategories();
  //   setData(res.data);
  // };

  useEffect(() => {
    // getSubCat();
  }, []);

  const deleteSubCat = async (id) => {
    // await axios.delete(
    //   `${process.env.REACT_APP_HOST}/categories/delete-category/${id}`
    // );
    // setData(data.filter((item) => item._id !== id));
  };

  return (
    <div className="container_a">
      <Link to="/admin/edit/category/add">Добавить</Link>
      <div className="list_a">
        {data?.map((item) => (
          <div className="item_a1" key={item._id}>
            <div>
              <div className="title">{item.title}</div>
            </div>
            <div>
              <Link to={`/admin/edit/category/${item._id}`}>Змінити</Link>
              <button onClick={() => deleteSubCat(item._id)}>Видалити</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
