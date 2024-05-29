import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductHttp } from "../../../http/ProductHttp";
import Image from "../../../components/image/image";
import { FilesHttp } from "../../../http/FileHttp";

export default function AdminProduct() {
  const [data, setData] = useState([]);

  const getProd = async () => {
    const res = await ProductHttp.getProducts();
    setData(res.data);
  };

  useEffect(() => {
    getProd();
  }, []);

  const deleteProd = async (id, images) => {
    if (images.length > 0) await FilesHttp.deleteFiles(images);

    await axios.delete(
      `${process.env.REACT_APP_HOST}/product/delete-product/${id}`
    );

    setData(data.filter((item) => item._id !== id));
  };

  return (
    <div className="container_a">
      <Link to="add">Добавить</Link>
      <div className="list_a">
        {data?.map((item) => (
          <div className="item_a2" key={item._id}>
            <Image
              src={
                item?.image[0]?.length > 3
                  ? `${process.env.REACT_APP_IMG}${item.image[0]}`
                  : []
              }
            />
            <div>
              <div className="title">{item.title}</div>
              <div className="price">{item.price}$</div>
            </div>
            <div>
              <Link to={item._id}>Змінити</Link>
              <button onClick={() => deleteProd(item._id, item.image || [])}>
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
