import { useEffect, useState } from "react";
import RichText from "../../../components/rich-text";
import axios from "axios";
import styles from "./pages.module.css";

export default function AdminPages() {
  const [privacyUa, setPrivacyUa] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);
  const [orderUa, setOrderUa] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);
  const [aboutUa, setAboutUa] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  const [privacyEn, setPrivacyEn] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);
  const [orderEn, setOrderEn] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);
  const [aboutEn, setAboutEn] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  const [infoData, setInfoData] = useState({});

  useEffect(() => {
    const getPages = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_HOST}/pages/get-pages`
        );

        if (data.length < 1) return;

        const defaultValue = [
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ];

        const privacyItemUa = data?.find(
          (item) => item.type === "privacy"
        )?.contentUa;
        const orderItemUa = data?.find(
          (item) => item.type === "order"
        )?.contentUa;
        const aboutItemUa = data?.find(
          (item) => item.type === "about"
        )?.contentUa;
        const privacyItemEn = data?.find(
          (item) => item.type === "privacy"
        )?.contentEn;
        const orderItemEn = data?.find(
          (item) => item.type === "order"
        )?.contentEn;
        const aboutItemEn = data?.find(
          (item) => item.type === "about"
        )?.contentEn;

        setPrivacyUa(privacyItemUa ? JSON.parse(privacyItemUa) : defaultValue);
        setOrderUa(orderItemUa ? JSON.parse(orderItemUa) : defaultValue);
        setAboutUa(aboutItemUa ? JSON.parse(aboutItemUa) : defaultValue);

        setPrivacyEn(privacyItemEn ? JSON.parse(privacyItemEn) : defaultValue);
        setOrderEn(orderItemEn ? JSON.parse(orderItemEn) : defaultValue);
        setAboutEn(aboutItemEn ? JSON.parse(aboutItemEn) : defaultValue);
      } catch (error) {
        console.error("Error fetching pages: ", error);
      }
    };

    getPages();
  }, []);

  const savePage = async (type, contentUa, contentEn) => {
    try {
      await axios.post(`${process.env.REACT_APP_HOST}/pages/update-page`, {
        type,
        contentUa: JSON.stringify(contentUa),
        contentEn: JSON.stringify(contentEn),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error saving page: ", error);
    }
  };

  useEffect(() => {
    const getInfo = async () => {
      const res = await axios.get(`${process.env.REACT_APP_HOST}/info`);

      setInfoData(res.data);
    };

    getInfo();
  }, []);

  const saveInfo = async () => {
    await axios.put(`${process.env.REACT_APP_HOST}/info`, {
      ...infoData,
    });
    window.location.reload();
  };

  return (
    <div className="container_a" style={{ marginBottom: "30px" }}>
      <h1 style={{ textAlign: "center" }}>Редагування сторінок</h1>

      <h2 style={{ marginTop: "60px" }}>
        Сторінка "Политика конфинденциальности"
      </h2>
      <h3>UA</h3>
      <RichText value={privacyUa} setValue={setPrivacyUa} />
      <h3>EN</h3>
      <RichText value={privacyEn} setValue={setPrivacyEn} />
      <button
        className={styles.btn_save}
        onClick={() => savePage("privacy", privacyUa, privacyEn)}
      >
        Зберегти
      </button>

      <h2 style={{ marginTop: "60px" }}>Сторінка "Условия доставки"</h2>
      <h3>UA</h3>
      <RichText value={orderUa} setValue={setOrderUa} />
      <h3>EN</h3>
      <RichText value={orderEn} setValue={setOrderEn} />
      <button
        className={styles.btn_save}
        onClick={() => savePage("order", orderUa, orderEn)}
      >
        Зберегти
      </button>

      <h2 style={{ marginTop: "60px" }}>Сторінка "Про нас"</h2>
      <h3>UA</h3>
      <RichText value={aboutUa} setValue={setAboutUa} />
      <h3>EN</h3>
      <RichText value={aboutEn} setValue={setAboutEn} />
      <button
        className={styles.btn_save}
        onClick={() => savePage("about", aboutUa, aboutEn)}
      >
        Зберегти
      </button>

      <fieldset className={styles.fieldset} style={{ marginTop: 40 }}>
        <label htmlFor="title">Телефон №1</label>
        <input
          type="text"
          name="phoneOne"
          placeholder="Телефон"
          defaultValue={infoData?.phoneOne}
          onChange={(e) =>
            setInfoData((prev) => ({ ...prev, phoneOne: e.target.value }))
          }
        />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <label htmlFor="title">Телефон №2</label>
        <input
          type="text"
          name="phoneTwo"
          placeholder="Телефон"
          defaultValue={infoData?.phoneTwo}
          onChange={(e) =>
            setInfoData((prev) => ({ ...prev, phoneTwo: e.target.value }))
          }
        />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <label htmlFor="title">Пошта</label>
        <input
          type="email"
          name="email"
          placeholder="Пошта"
          defaultValue={infoData?.email}
          onChange={(e) =>
            setInfoData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </fieldset>
      <button className={styles.btn_save} onClick={saveInfo}>
        Зберегти
      </button>
    </div>
  );
}
