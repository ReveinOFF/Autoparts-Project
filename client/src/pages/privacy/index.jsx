import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ConvertJsonToHtml from "../../utils/rich-html";

export default function Privacy() {
  const [value, setValue] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const getPages = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_HOST}/pages/get-page/privacy`
        );

        if (!data) return;

        setValue(data);
      } catch (error) {
        console.error("Error fetching pages: ", error);
      }
    };

    getPages();
  }, []);

  return (
    <div className="container">
      <h1 className="h1_infoblock">{t("privacy")}</h1>
      {value && (
        <>
          {i18n.language === "ua" ? (
            <div
              className="div_infoblock"
              dangerouslySetInnerHTML={{
                __html: ConvertJsonToHtml(JSON.parse(value?.contentUa)),
              }}
            ></div>
          ) : (
            <div
              className="div_infoblock"
              dangerouslySetInnerHTML={{
                __html: ConvertJsonToHtml(JSON.parse(value?.contentEn)),
              }}
            ></div>
          )}
        </>
      )}
    </div>
  );
}
