import infoImg from "../../assets/images/contact/info.svg";
import phoneImg from "../../assets/images/contact/phone.svg";
import mailImg from "../../assets/images/contact/mail.svg";
import styles from "../contact/contact.module.css";
import axios from "axios";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

export default function ReturnGoods() {
  const onHandleSubmit = async (formData) => {
    await axios.post(`${process.env.REACT_APP_HOST}/contact`, formData);
    window.location.reload();
  };

  const UpdateSchema = Yup.object().shape({
    email: Yup.string()
      .email("Write correct email")
      .required("This field is required")
      .max(30, "Max length is 30 symbols"),
    name: Yup.string()
      .required("This field is required")
      .max(30, "Max length is 30 symbols"),
    product: Yup.string()
      .required("This field is required")
      .max(30, "Max length is 30 symbols"),
    message: Yup.string().required("This field is required"),
  });

  const initialValues = {
    name: "",
    email: "",
    product: "",
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
    errors,
    dirty,
    handleBlur,
  } = formik;

  return (
    <div className="container" style={{ marginBottom: 60 }}>
      <h1 className="h1_infoblock">Повернення товару</h1>
      <h2 className={styles.h2}>Введіть дані</h2>
      <FormikProvider value={formik}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <fieldset>
              <label htmlFor="name">
                Ім`я <img src={infoImg} alt="info" width={15} />
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
                Ел. адреса <img src={infoImg} alt="info" width={15} />
              </label>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="email">
                Товар, який хочете повернути
                <img src={infoImg} alt="info" width={15} />
              </label>
              <input
                type="text"
                name="product"
                value={values.product}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </fieldset>
          </div>
          <fieldset>
            <label htmlFor="message">Причина повернення</label>
            <textarea
              name="message"
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
            ></textarea>
          </fieldset>
          <button disabled={isSubmitting || !dirty || !isValid}>
            Надіслати
          </button>
        </form>
      </FormikProvider>
      <h2 className={styles.h2}>Зв`яжіться з нами</h2>
      <h3 className={styles.h3}>Телефон</h3>
      <div className={styles.info_contact}>
        <img src={phoneImg} alt="phone" width={25} />
        <span>+380661231231</span>
      </div>
      <div className={styles.info_contact}>
        <img src={phoneImg} alt="phone" width={25} />
        <span>+380631231231</span>
      </div>
      <h3 className={styles.h3}>Пошта</h3>
      <div className={styles.info_contact}>
        <img src={mailImg} alt="email" width={25} />
        <span>autopartsinvolved@gmail.com</span>
      </div>
    </div>
  );
}