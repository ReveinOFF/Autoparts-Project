import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "../../../styles/add.module.css";
import { BrandHttp } from "../../../http/BrandHttp";
import MultiSelect from "../../../components/admin/multi-select";
import arrowImg from "../../../assets/images/header/arrow.svg";
import { ProductHttp } from "../../../http/ProductHttp";

export default function AddSubCat() {
  const [type, setType] = useState("add");
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [subcategory, setSubCategory] = useState([]);
  const [mark, setMark] = useState([]);
  const [product, setProduct] = useState([]);
  const [markShow, setMarkShow] = useState(false);
  const [subcatShow, setSubcatShow] = useState(false);
  const [productShow, setProductShow] = useState(false);

  useEffect(() => {
    if (id === "add") {
      setType("add");
    } else {
      axios
        .get(`${process.env.REACT_APP_HOST}/subcategories/get-by-id/${id}`)
        .then((res) => {
          setData(res.data);
          setType("id");
        });
    }
  }, []);

  useEffect(() => {
    BrandHttp.getBrands().then((res) => {
      setMark(res.data);
    });
  }, []);

  useEffect(() => {
    ProductHttp.getProducts().then((res) => {
      setProduct(res.data);
    });
  }, []);

  const getSubCategory = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_HOST}/subcategories/get-all`
    );
    setSubCategory(res.data.filter((item) => item._id !== id));
  };

  useEffect(() => {
    getSubCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === "add") {
      await axios.post(
        `${process.env.REACT_APP_HOST}/subcategories/add-subcategories`,
        { ...data }
      );
      navigate("/admin/edit/subcategory");
    } else {
      await axios.put(
        `${process.env.REACT_APP_HOST}/subcategories/upt-subcategories`,
        { _id: id, ...data }
      );
      window.location.reload();
    }
  };

  return (
    <div className="container_a">
      {subcatShow && (
        <MultiSelect
          data={subcategory || []}
          changeSelected={(list) => {
            setData((prev) => ({ ...prev, subChildCategorieIds: list || [] }));
            setSubcatShow(!subcatShow);
          }}
          selected={data?.subChildCategorieIds}
          onClose={() => setSubcatShow(false)}
        />
      )}
      {markShow && (
        <MultiSelect
          data={mark || []}
          changeSelected={(list) => {
            setData((prev) => ({ ...prev, markIds: list || [] }));
            setMarkShow(!markShow);
          }}
          selected={data?.markIds}
          onClose={() => setMarkShow(false)}
        />
      )}
      {productShow && (
        <MultiSelect
          data={product || []}
          changeSelected={(list) => {
            setData((prev) => ({ ...prev, productIds: list || [] }));
            setProductShow(!productShow);
          }}
          selected={data?.productIds}
          onClose={() => setProductShow(false)}
        />
      )}
      <h1 className={styles.h1}>
        {type === "add" ? "Створити під-каталог" : "Редагувати під-каталог"}
      </h1>
      <Link to="/admin/edit/subcategory" className={styles.a}>
        Назад
      </Link>
      <form onSubmit={handleSubmit} className={styles.form}>
        <fieldset>
          <label htmlFor="title">Назва</label>
          <input
            type="text"
            name="title"
            placeholder="Назва"
            defaultValue={data?.title}
            onChange={(e) =>
              setData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </fieldset>
        <fieldset>
          <label htmlFor="title">Опис</label>
          <textarea
            name="description"
            placeholder="Опис"
            defaultValue={data?.description}
            onChange={(e) =>
              setData((prev) => ({ ...prev, description: e.target.value }))
            }
          ></textarea>
        </fieldset>
        <fieldset>
          <label htmlFor="price">Суб-Категорія</label>
          <div className={styles.sl} onClick={() => setSubcatShow(true)}>
            <span>
              {subcategory
                ?.filter((item) =>
                  data?.subChildCategorieIds?.includes(item._id)
                )
                ?.map((item) => item.title)
                ?.join(", ") || "Не вибрано"}
            </span>
            <img src={arrowImg} alt="arrow" width={10} />
          </div>
        </fieldset>
        <fieldset>
          <label htmlFor="price">Бренд</label>
          <div className={styles.sl} onClick={() => setMarkShow(true)}>
            <span>
              {mark
                ?.filter((item) => data?.markIds?.includes(item._id))
                ?.map((item) => item.title)
                ?.join(", ") || "Не вибрано"}
            </span>
            <img src={arrowImg} alt="arrow" width={10} />
          </div>
        </fieldset>
        <fieldset>
          <label htmlFor="price">Товари</label>
          <div className={styles.sl} onClick={() => setProductShow(true)}>
            <span>
              {product
                ?.filter((item) => data?.productIds?.includes(item._id))
                ?.map((item) => item.title)
                ?.join(", ") || "Не вибрано"}
            </span>
            <img src={arrowImg} alt="arrow" width={10} />
          </div>
        </fieldset>
        <button type="submit">{type === "add" ? "Створити" : "Змінити"}</button>
      </form>
    </div>
  );
}
