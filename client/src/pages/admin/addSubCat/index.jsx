import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AddSubCat() {
  const [type, setType] = useState("add");
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [subcategory, setSubCategory] = useState([]);

  useEffect(() => {
    if (id === "add") {
      setType("add");
    } else {
      axios
        .get(`${process.env.REACT_APP_HOST}/subcategories/get-all`)
        .then((res) => {
          setData(res.data);
          setType("id");
        });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === "add") {
      await CategoriesHttp.addCategories(data);
      navigate("/admin/edit/category");
    } else {
      await CategoriesHttp.putCategories({ _id: id, ...data });
      window.location.reload();
    }
  };

  const getSubCategory = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_HOST}/subcategories/get-all`
    );
    setSubCategory(res.data);
  };

  useEffect(() => {
    getSubCategory();
  }, []);

  return (
    <div className="container_a">
      {catShow && (
        <MultiSelect
          data={subcategory || []}
          changeSelected={(list) => {
            setData((prev) => ({ ...prev, subCategorieIds: list || [] }));
            setCatShow(!catShow);
          }}
          selected={data?.subCategorieIds}
          onClose={() => setCatShow(false)}
        />
      )}
      <h1 className={styles.h1}>
        {type === "add" ? "Create Sub-Category" : "Update Sub-Category"}
      </h1>
      <Link to="/admin/edit/sub-cat" className={styles.a}>
        Назад
      </Link>
      <form onSubmit={handleSubmit} className={styles.form}>
        <fieldset>
          <label htmlFor="title">Назва</label>
          <input
            type="text"
            name="title"
            placeholder="Назва"
            defaultValue={data.title}
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
            defaultValue={data.description}
            onChange={(e) =>
              setData((prev) => ({ ...prev, description: e.target.value }))
            }
          ></textarea>
        </fieldset>
        <fieldset>
          <label htmlFor="price">Суб-Категорія</label>
          <div className={styles.sl} onClick={() => setCatShow(true)}>
            <span>
              {subcategory
                ?.filter((item) => data?.subCategorieIds?.includes(item._id))
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
