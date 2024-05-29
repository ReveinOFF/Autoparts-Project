import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BrandHttp } from "../../../http/BrandHttp";
import styles from "../../../styles/add.module.css";
import closeImg from "../../../assets/images/admin/ha_exit.svg";
import { FilesHttp } from "../../../http/FileHttp";

export default function AddMark() {
  const [type, setType] = useState("");
  const refInp = useRef();
  const [data, setData] = useState({});
  const [file, setFile] = useState();
  const [urlImg, setUrlImg] = useState();
  const [img, setImg] = useState();
  const [imgDel, setImgDel] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === "add") {
      setType("add");
    } else {
      BrandHttp.getBrand(id).then((res) => {
        setData(res.data);
        setType("id");
        setImg(res.data.image);
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let sendData = data;
    let image = "";

    if (file) {
      const form = new FormData();
      form.append(`file`, file);
      const res = await FilesHttp.uploadFileOne(form);
      sendData.image = res.data;

      if (res.data.length > 0) {
        sendData.image = res.data;
        image = res.data;
      }
    }

    if (type === "add") {
      await BrandHttp.addBrand(sendData);
      navigate("/admin/edit/mark");
    } else {
      if (imgDel && !img) {
        await FilesHttp.deleteFile(data.image);
        setImgDel(false);
        await BrandHttp.putBrand({ _id: id, ...sendData, image: image });
      } else await BrandHttp.putBrand({ _id: id, ...sendData });
      window.location.reload();
    }
  };

  const deleteImg = () => {
    setImgDel(true);
    setFile(null);
    setUrlImg(null);
    setImg(null);
  };

  return (
    <div className="container_a">
      <h1 className={styles.h1}>
        {type === "add" ? "Create Brand" : "Update Brand"}
      </h1>
      <Link to="/admin/edit/mark" className={styles.a}>
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
        <button type="submit">{type === "add" ? "Створити" : "Змінити"}</button>
      </form>
    </div>
  );
}
