import infoImg from "../../assets/images/contact/info.svg";
import phoneImg from "../../assets/images/contact/phone.svg";
import mailImg from "../../assets/images/contact/mail.svg";
import closeImg from "../../assets/images/admin/ha_exit.svg";
import styles from "./contact.module.css";
import axios from "axios";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import contactImg from "../../assets/images/contact/contact.svg";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const [show, setShow] = useState(false);
  const [infoData, setInfoData] = useState({});
  const { t } = useTranslation();

  const onHandleSubmit = async (formData) => {
    await axios.post(`${process.env.REACT_APP_HOST}/contact`, formData);
    resetForm();
    setShow(true);
  };

  const UpdateSchema = Yup.object().shape({
    email: Yup.string()
      .email("Write correct email")
      .required("This field is required")
      .max(30, "Max length is 30 symbols"),
    name: Yup.string()
      .required("This field is required")
      .max(30, "Max length is 30 symbols"),
    message: Yup.string().required("This field is required"),
  });

  const initialValues = {
    name: "",
    email: "",
    message: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: UpdateSchema,
    onSubmit: onHandleSubmit,
    validateOnChange: true,
  });

  const {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    resetForm,
    errors,
    dirty,
    handleBlur,
  } = formik;

  useEffect(() => {
    const getInfo = async () => {
      const res = await axios.get(`${process.env.REACT_APP_HOST}/info`);

      setInfoData(res.data);
    };

    getInfo();
  }, []);

  return (
    <div className="container" style={{ marginBottom: 60 }}>
      {show && (
        <div className="succ">
          <div>
            <img src={closeImg} alt="close" onClick={() => setShow(false)} />
            <img src={contactImg} alt="contact" />
            <h1>{t("contact.mess-h1")}</h1>
            <p>{t("contact.p")}</p>
          </div>
        </div>
      )}
      <h1 className="h1_infoblock">{t("contact.h1")}</h1>
      <h2 className={styles.h2}>{t("contact.h2")}</h2>
      <FormikProvider value={formik}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <fieldset>
              <label htmlFor="name">
                {t("contact.name")} <img src={infoImg} alt="info" width={15} />
              </label>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="email">
                {t("contact.email")} <img src={infoImg} alt="info" width={15} />
              </label>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </fieldset>
          </div>
          <fieldset>
            <label htmlFor="message">{t("contact.mess")}</label>
            <textarea
              name="message"
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
            ></textarea>
          </fieldset>
          <button disabled={isSubmitting || !dirty || !isValid}>
            {t("contact.btn")}
          </button>
        </form>
      </FormikProvider>
      <h2 className={styles.h2}>{t("contact.call")}</h2>
      <h3 className={styles.h3}>{t("contact.phone")}</h3>
      <div className={styles.info_contact}>
        <img src={phoneImg} alt="phone" width={25} />
        <span>{infoData?.phoneOne}</span>
      </div>
      <div className={styles.info_contact}>
        <img src={phoneImg} alt="phone" width={25} />
        <span>{infoData?.phoneTwo}</span>
      </div>
      <h3 className={styles.h3}>{t("contact.email2")}</h3>
      <div className={styles.info_contact}>
        <img src={mailImg} alt="email" width={25} />
        <span>{infoData?.email}</span>
      </div>
    </div>
  );
}
