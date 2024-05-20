import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ConvertJsonToHtml from "../../utils/rich-html";
import axios from "axios";

export default function OrderInfo() {
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);
  const { i18n } = useTranslation();

  useEffect(() => {
    const getPages = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_HOST}/pages/get-page/order`
        );

        if (!data) return;

        console.log(i18n.language);

        setValue(
          i18n.language === "ua"
            ? JSON.parse(data.contentUa)
            : JSON.parse(data.contentEn)
        );
      } catch (error) {
        console.error("Error fetching pages: ", error);
      }
    };

    getPages();
  }, []);

  return (
    <div className="container">
      <h1 className="h1_infoblock">Інформація про доставку</h1>
      <div
        className="div_infoblock"
        dangerouslySetInnerHTML={{ __html: ConvertJsonToHtml(value) }}
      ></div>
    </div>
  );
}
