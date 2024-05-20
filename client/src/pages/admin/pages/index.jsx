import { useEffect, useState } from "react";
import RichText from "../../../components/rich-text";
import axios from "axios";

export default function AdminPages() {
  const [contact, setContact] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);
  const [privacy, setPrivacy] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);
  const [order, setOrder] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);
  const [about, setAbout] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  useEffect(() => {
    const getPages = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_HOST}/pages/get-pages`
      );

      if (!data) return;

      setContact(data.find((item) => item.type === "contact"));
      setPrivacy(data.find((item) => item.type === "privacy"));
      setOrder(data.find((item) => item.type === "order"));
      setAbout(data.find((item) => item.type === "about"));
    };

    getPages();
  }, []);

  const saveAbout = async () => {
    await axios.post(`${process.env.REACT_APP_HOST}/pages/update-page`, {
      type: "about",
      content: JSON.stringify(about),
    });
    window.location.reload();
  };

  const saveContact = async () => {
    await axios.post(`${process.env.REACT_APP_HOST}/pages/update-page`, {
      type: "contact",
      content: JSON.stringify(contact),
    });
    window.location.reload();
  };

  const savePrivacy = async () => {
    await axios.post(`${process.env.REACT_APP_HOST}/pages/update-page`, {
      type: "privacy",
      content: JSON.stringify(privacy),
    });
    window.location.reload();
  };

  const saveOrder = async () => {
    await axios.post(`${process.env.REACT_APP_HOST}/pages/update-page`, {
      type: "order",
      content: JSON.stringify(order),
    });
    window.location.reload();
  };

  return (
    <div className="container_a" style={{ marginBottom: "30px" }}>
      <h1 style={{ textAlign: "center" }}>Редагування сторінок</h1>
      <h2 style={{ marginTop: "30px" }}>Сторінка "Контакти"</h2>
      <RichText value={contact} setValue={setContact} onClick={saveContact} />
      <h2 style={{ marginTop: "60px" }}>
        Сторінка "Политика конфинденциальности"
      </h2>
      <RichText value={privacy} setValue={setPrivacy} onClick={savePrivacy} />
      <h2 style={{ marginTop: "60px" }}>Сторінка "Условия доставки"</h2>
      <RichText value={order} setValue={setOrder} onClick={saveOrder} />
      <h2 style={{ marginTop: "60px" }}>Сторінка "Про нас"</h2>
      <RichText value={about} setValue={setAbout} onClick={saveAbout} />
    </div>
  );
}
