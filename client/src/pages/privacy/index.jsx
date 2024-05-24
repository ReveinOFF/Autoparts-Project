import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ConvertJsonToHtml from "../../utils/rich-html";

export default function Privacy() {
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
          `${process.env.REACT_APP_HOST}/pages/get-page/privacy`
        );

        if (!data) return;

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
      <h1 className="h1_infoblock">Політика конфіденційності</h1>
      <div
        className="div_infoblock"
        dangerouslySetInnerHTML={{ __html: ConvertJsonToHtml(value) }}
      ></div>
    </div>
  );
}