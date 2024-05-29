import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BrandHttp } from "../../../http/BrandHttp";
import styles from "../../../styles/add.module.css";
import arrowImg from "../../../assets/images/header/arrow.svg";
import MultiSelect from "../../../components/admin/multi-select";
import closeImg from "../../../assets/images/admin/ha_exit.svg";
import { FilesHttp } from "../../../http/FileHttp";

export default function AddModel() {
  const [type, setType] = useState("");
  const refInp = useRef();
  const [data, setData] = useState({});
  const [file, setFile] = useState();
  const [urlImg, setUrlImg] = useState();
  const [img, setImg] = useState();
  const [mark, setMark] = useState([]);
  const [catMark, setMarkShow] = useState(false);
  const [markSelected, setMarkSelected] = useState([]);
  const [imgDel, setImgDel] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === "add") {
      setType("add");
    } else {
      BrandHttp.getModel(id).then((res) => {
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

    if (markSelected?.length > 0) sendData.markIds = markSelected;

    if (type === "add") {
      await BrandHttp.addModel(sendData);
      navigate("/admin/edit/mark");
    } else {
      if (imgDel && !img) {
        await FilesHttp.deleteFile(data.image);
        setImgDel(false);
        await BrandHttp.putModel({ _id: id, ...sendData, image: image });
      } else await BrandHttp.putModel({ _id: id, ...sendData });
      window.location.reload();
    }
  };

  const getMarks = async () => {
    const res = await BrandHttp.getBrands();

    setMark(res.data);
  };

  useEffect(() => {
    getMarks();
  }, []);

  const deleteImg = () => {
    setImgDel(true);
    setFile(null);
    setUrlImg(null);
    setImg(null);
  };

  return (
    <div className="container_a">
      {catMark && (
        <MultiSelect
          data={mark || []}
          changeSelected={(list) => {
            setMarkSelected(list);
            setMarkShow(!catMark);
          }}
          selected={
            markSelected?.length > 0
              ? markSelected
              : data?.markIds?.length > 0
              ? mark
                  .filter((item) => data?.markIds?.includes(item._id))
                  ?.map((m) => m._id)
              : []
          }
          onClose={() => setMarkShow(false)}
        />
      )}
      <h1 className={styles.h1}>
        {type === "add" ? "Create Model" : "Update Model"}
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
        <fieldset>
          <label htmlFor="model">Бренд</label>
          <div className={`${styles.sl}`} onClick={() => setMarkShow(true)}>
            <span>
              {mark
                ?.filter(
                  (item) =>
                    markSelected?.includes(item._id) ||
                    data?.markIds?.includes(item._id)
                )
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
