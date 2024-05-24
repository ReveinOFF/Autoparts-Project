import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CategoriesHttp } from "../../../http/CategoriesHttp";
import arrowImg from "../../../assets/images/header/arrow.svg";
import styles from "../../../styles/add.module.css";
import axios from "axios";
import closeImg from "../../../assets/images/admin/ha_exit.svg";
import MultiSelect from "../../../components/admin/multi-select";
import { FilesHttp } from "../../../http/FileHttp";

export default function AddCategory() {
  const [type, setType] = useState("add");
  const [data, setData] = useState({ title: "", description: "" });
  const refInp = useRef();
  const { id } = useParams();
  const [file, setFile] = useState();
  const [urlImg, setUrlImg] = useState();
  const [img, setImg] = useState();
  const [imgDel, setImgDel] = useState(false);
  const navigate = useNavigate();
  const [catShow, setCatShow] = useState(false);
  const [subcategory, setSubCategory] = useState([]);

  useEffect(() => {
    if (id === "add") {
      setType("add");
    } else {
      CategoriesHttp.getCategory(id).then((res) => {
        setData(res.data);
        setType("id");
        setImg(res.data.image);
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let image = "";

    if (file) {
      const form = new FormData();
      form.append(`file`, file);
      const res = await FilesHttp.uploadFileOne(form);
      image = res.data;
    }

    if (type === "add") {
      data.image = image;
      await CategoriesHttp.addCategories(data);
      navigate("/admin/edit/category");
    } else {
      if (imgDel && !img) {
        await FilesHttp.deleteFile(data.image);
        setImgDel(false);
      }
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

  const deleteImg = () => {
    setImgDel(true);
    setFile(null);
    setUrlImg(null);
    setImg(null);
  };

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
        {type === "add" ? "Create Category" : "Update Category"}
      </h1>
      <Link to="/admin/edit/category" className={styles.a}>
        Назад
      </Link>
      <form onSubmit={handleSubmit} className={styles.form}>
        <fieldset>
          <button type="button" onClick={() => refInp.current.click()}>
            Загрузити фотографії
            <input
              type="file"
              name="file"
              accept=".jpg, .jpeg, .png"
              ref={refInp}
              onChange={(e) => {
                if (e.target.files[0]) {
                  setFile(e.target.files[0]);
                  setUrlImg(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
          </button>
          <div
            className={styles.images}
            style={{ marginInline: "auto", display: "flex", width: "200px" }}
          >
            {urlImg && (
              <div>
                <img
                  src={closeImg}
                  alt="delete"
                  width={20}
                  height={20}
                  onClick={deleteImg}
                />
                <img src={urlImg} alt="img" />
              </div>
            )}
            {img && (
              <div>
                <img
                  src={closeImg}
                  alt="delete"
                  width={20}
                  height={20}
                  onClick={deleteImg}
                />
                <img
                  src={`${process.env.REACT_APP_IMG}${data.image}`}
                  alt="img"
                />
              </div>
            )}
          </div>
        </fieldset>
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
