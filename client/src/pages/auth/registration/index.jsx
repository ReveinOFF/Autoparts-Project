import { FormikProvider, useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import AuthInput from "../../../components/auth-input";
import { Link, useNavigate } from "react-router-dom";
import styles from "../login/login.module.css";
import axios from "axios";

export default function Registration() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onHandleSubmit = async (formData) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_HOST}/authentication/registration`,
        formData
      );
      localStorage.setItem("token", data?.token);
      navigate("/");
      window.location.reload();
    } catch (error) {
      alert(error?.response?.data?.message || t("reg.err"));
    }
  };

  const UpdateSchema = Yup.object().shape({
    login: Yup.string()
      .email(t("validation.email"))
      .required(t("validation.req"))
      .max(30, t("validation.max30")),
    name: Yup.string()
      .required(t("validation.req"))
      .min(2, t("validation.min2"))
      .max(30, t("validation.max30")),
    surname: Yup.string()
      .min(2, t("validation.min2"))
      .max(30, t("validation.max30")),
    password: Yup.string()
      .required(t("validation.req"))
      .min(8, t("validation.min8"))
      .max(30, t("validation.max30")),
  });

  const initialValues = {
    login: "",
    name: "",
    surname: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: UpdateSchema,
    onSubmit: onHandleSubmit,
    validateOnChange: true,
  });

  const { values, handleChange, handleSubmit, errors, handleBlur } = formik;

  return (
    <div className={styles.login}>
      <div className="container">
        <FormikProvider value={formik}>
          <form onSubmit={handleSubmit}>
            <h2 className={styles.authForm_Name}>{t("reg.h2")}</h2>
            <AuthInput
              title={t("reg.email")}
              name="login"
              type="email"
              value={values.login}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.login}
            />
            <AuthInput
              title={t("reg.name")}
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
            />
            <AuthInput
              title={t("reg.surname")}
              name="surname"
              type="text"
              value={values.surname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.surname}
            />
            <AuthInput
              title={t("reg.pass")}
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
            />
            <div className={styles.formPart}>
              <label htmlFor="email">{t("reg.rememb")}</label>
              <input type="checkbox" />
            </div>
            <button type="submit" className={styles.formSubmitBtn}>
              {t("reg.btn")}
            </button>
            <div className={styles.suggestionBlock}>
              {t("reg.not-reg")} <Link to="/login">{t("reg.reg")}</Link>
            </div>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}
