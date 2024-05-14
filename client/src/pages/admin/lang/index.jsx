import axios from "axios";
import { useState, useEffect } from "react";
import uaImg from "../../../assets/images/header/ua.png";
import enImg from "../../../assets/images/header/en.png";
import styles from "./lang.module.css";

export default function LangAdmin() {
  const [lang, setLang] = useState({ en: false, ua: false });

  const getLang = async () => {
    const res = await axios.get(`${process.env.REACT_APP_HOST}/lang`);
    setLang(res.data);
  };

  useEffect(() => {
    getLang();
  }, []);

  const updateLang = async (e) => {
    const { name } = e.target;
    setLang((prevLang) => ({
      ...prevLang,
      [name]: !prevLang[name],
    }));

    await axios.put(`${process.env.REACT_APP_HOST}/lang`, {
      ...lang,
      [name]: !lang[name],
    });
  };

  return (
    <div className="container_a flex-full">
      <div className={styles.lang_list}>
        <div className={styles.lang_block}>
          <img src={uaImg} alt="ua" width={40} />
          <label htmlFor="ua">UA</label>
          <input
            type="checkbox"
            name="ua"
            checked={lang.ua}
            onChange={updateLang}
          />
        </div>
        <div className={styles.lang_block}>
          <img src={enImg} alt="ua" width={40} />
          <label htmlFor="en">EN</label>
          <input
            type="checkbox"
            name="en"
            checked={lang.en}
            onChange={updateLang}
          />
        </div>
      </div>
    </div>
  );
}
