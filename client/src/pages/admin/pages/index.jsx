import { useEffect, useState } from "react";
import RichText from "../../../components/rich-text";

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

  useEffect(() => {}, []);

  const saveAbout = async () => {
    console.log(JSON.stringify(contact));
  };

  return (
    <div className="container_a" style={{ marginBottom: "30px" }}>
      <h1 style={{ textAlign: "center" }}>Редагування сторінок</h1>
      <h2 style={{ marginTop: "30px" }}>Сторінка "Контакти"</h2>
      <RichText value={contact} setValue={setContact} onClick={saveAbout} />
      <h2 style={{ marginTop: "60px" }}>
        Сторінка "Политика конфинденциальности"
      </h2>
      <RichText value={privacy} setValue={setPrivacy} onClick={saveAbout} />
      <h2 style={{ marginTop: "60px" }}>Сторінка "Условия доставки"</h2>
      <RichText value={order} setValue={setOrder} onClick={saveAbout} />
    </div>
  );
}
