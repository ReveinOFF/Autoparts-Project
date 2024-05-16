import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CategoriesHttp } from "../../../http/CategoriesHttp";
import styles from "../../../styles/add.module.css";

export default function AddCategory() {
  const [type, setType] = useState("add");
  const [data, setData] = useState({ title: "", description: "" });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === "add") {
      setType("add");
    } else {
      CategoriesHttp.getCategory(id).then((res) => {
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

  return (
    <div className="container_a">
      <h1 className={styles.h1}>
        {type === "add" ? "Create Category" : "Update Category"}
      </h1>
      <Link to="/admin/edit/category" className={styles.a}>
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
        <button type="submit">{type === "add" ? "Створити" : "Змінити"}</button>
      </form>
    </div>
  );
}
