import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CategoriesHttp } from "../../../http/CategoriesHttp";
import Image from "../../../components/image/image";

export default function AdminCategory() {
  const [data, setData] = useState([]);

  const getCat = async () => {
    const res = await CategoriesHttp.getCategories();
    setData(res.data);
  };

  useEffect(() => {
    getCat();
  }, []);

  const deleteCat = async (id) => {
    await axios.delete(
      `${process.env.REACT_APP_HOST}/categories/delete-category/${id}`
    );
    setData(data.filter((item) => item._id !== id));
  };

  return (
    <div className="container_a">
      <Link to="/admin/edit/category/add">Добавить</Link>
      <div className="list_a">
        {data?.map((item) => (
          <div className="item_a2" key={item._id}>
            <Image
              src={
                item?.image?.length > 3
                  ? `${process.env.REACT_APP_IMG}${item.image}`
                  : []
              }
            />
            <div>
              <div className="title">{item.title}</div>
              <div className="desc">{item.description}</div>
            </div>
            <div>
              <Link to={`/admin/edit/category/${item._id}`}>Змінити</Link>
              <button onClick={() => deleteCat(item._id)}>Видалити</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
