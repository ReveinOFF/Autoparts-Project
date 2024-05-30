import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "../../../styles/add.module.css";
import { ProductHttp } from "../../../http/ProductHttp";
import arrowImg from "../../../assets/images/header/arrow.svg";
import MultiSelect from "../../../components/admin/multi-select";
import { BrandHttp } from "../../../http/BrandHttp";
import closeImg from "../../../assets/images/admin/ha_exit.svg";
import { FilesHttp } from "../../../http/FileHttp";
import RichText from "../../../components/rich-text";

export default function AddProduct() {
  const refInp = useRef();
  const [type, setType] = useState("add");
  const [data, setData] = useState({});
  const [files, setFiles] = useState([]);
  const [urlImg, setUrlImg] = useState([]);
  const [oldImg, setOldImg] = useState([]);
  const [delImg, setDelImg] = useState([]);
  const [model, setModel] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [modelSelected, setModelSelected] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const [desc, setDesc] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);
  const [charact, setCharact] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  useEffect(() => {
    if (id === "add") {
      setType("add");
    } else {
      ProductHttp.getProduct(id).then((res) => {
        const defaultValue = [
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ];

        setData(res.data);
        setModelSelected(res.data.modelIds || []);
        setOldImg(res.data.image || []);
        setDesc(
          res.data.description ? JSON.parse(res.data.description) : defaultValue
        );
        setCharact(
          res.data.characteristics
            ? JSON.parse(res.data.characteristics)
            : defaultValue
        );
        setType("id");
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formDataObject = {};

    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    delete formDataObject["files"];
    formDataObject["modelIds"] = modelSelected;
    formDataObject["description"] = JSON.stringify(desc);
    formDataObject["characteristics"] = JSON.stringify(charact);

    if (files.length > 0) {
      const form = new FormData();
      files.forEach((item) => form.append(`files`, item));
      const res = await FilesHttp.uploadFile(form);
      formDataObject["image"] = res.data;
    }

    if (type === "add") {
      await ProductHttp.addProduct(formDataObject);
      navigate("/admin/edit/products");
    } else {
      await FilesHttp.deleteFiles(delImg);
      if (formDataObject["image"]) {
        formDataObject["image"] = [...formDataObject["image"], ...oldImg];
      } else {
        formDataObject["image"] = oldImg;
      }
      await ProductHttp.putProduct({ _id: id, ...formDataObject });
      window.location.reload();
    }
  };

  const getModel = async () => {
    const res = await BrandHttp.getModels();
    setModel(res?.data || []);
  };

  const deleteImg = (i) => {
    setUrlImg((prev) => prev.filter((_, index) => index !== i));
    setFiles((prev) => prev.filter((_, index) => index !== i));
  };

  const deleteOldImg = async (i) => {
    setOldImg((prev) => prev.filter((item) => item !== i));
    setDelImg((prev) => [...prev, i]);
  };

  useEffect(() => {
    getModel();
  }, []);

  return (
    <div className="container_a">
      {showModel && (
        <MultiSelect
          data={model || []}
          changeSelected={(list) => {
            setModelSelected(list);
            setShowModel(!showModel);
          }}
          selected={modelSelected}
          onClose={() => setShowModel(false)}
        />
      )}
      <h1 className={styles.h1}>
        {type === "add" ? "Створити продукт" : "Редагувати продукт"}
      </h1>
      <Link to="/admin/edit/products" className={styles.a}>
        Назад
      </Link>
      <form onSubmit={handleSubmit} className={styles.form}>
        <fieldset>
          <button type="button" onClick={() => refInp.current.click()}>
            Загрузити фотографії
            <input
              type="file"
              name="files"
              multiple
              accept=".jpg, .jpeg, .png"
              ref={refInp}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const newFiles = Array.from(e.target.files);
                  setFiles(newFiles);
                  newFiles.forEach((item) => {
                    setUrlImg((prev) => [...prev, URL.createObjectURL(item)]);
                  });
                }
              }}
            />
          </button>
          <div className={styles.images}>
            {urlImg?.map((item, index) => (
              <div key={index}>
                <img
                  src={closeImg}
                  alt="delete"
                  width={20}
                  height={20}
                  onClick={() => deleteImg(index)}
                />
                <img src={item} alt="img-url" />
              </div>
            ))}
            {oldImg?.map((item, index) => (
              <div key={index}>
                <img
                  src={closeImg}
                  alt="delete"
                  width={20}
                  height={20}
                  onClick={() => deleteOldImg(item)}
                />
                <img
                  src={`${process.env.REACT_APP_IMG}${item}`}
                  alt="img-url"
                />
              </div>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <label htmlFor="title">Назва</label>
          <input
            type="text"
            name="title"
            placeholder="Назва"
            defaultValue={data?.title}
          />
        </fieldset>
        <fieldset className={styles.rich_prod}>
          <label htmlFor="title">Опис</label>
          <RichText value={desc} setValue={setDesc} />
        </fieldset>
        <fieldset className={styles.rich_prod}>
          <label htmlFor="title">Характеристика</label>
          <RichText value={charact} setValue={setCharact} />
        </fieldset>
        <fieldset>
          <label htmlFor="price">Ціна</label>
          <input
            type="text"
            name="price"
            placeholder="Ціна"
            defaultValue={data?.price}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="model">Модель</label>
          <div className={`${styles.sl}`} onClick={() => setShowModel(true)}>
            <span>
              {model
                ?.filter((item) => modelSelected.includes(item._id))
                .map((item) => item.title)
                .join(", ") || "Не вибрано"}
            </span>
            <img src={arrowImg} alt="arrow" width={10} />
          </div>
        </fieldset>
        <button type="submit">{type === "add" ? "Створити" : "Змінити"}</button>
      </form>
    </div>
  );
}
