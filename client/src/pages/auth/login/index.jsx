import { Link, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { FormikProvider, useFormik } from "formik";
import AuthInput from "../../../components/auth-input";
import axios from "axios";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onHandleSubmit = async (formData) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_HOST}/authentication/login`,
        formData
      );
      localStorage.setItem("token", data?.token);
      navigate("/");
      window.location.reload();
    } catch (error) {
      alert(error?.response?.data?.message || t("login.err"));
    }
  };

  const UpdateSchema = Yup.object().shape({
    login: Yup.string()
      .email(t("validation.email"))
      .required(t("validation.req"))
      .max(30, t("validation.max30")),
    password: Yup.string()
      .required(t("validation.req"))
      .min(8, t("validation.min8"))
      .max(30, t("validation.max30")),
  });

  const initialValues = {
    login: "",
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
            <h2 className={styles.authForm_Name}>{t("login.h2")}</h2>
            <AuthInput
              title={t("login.email")}
              name="login"
              type="email"
              value={values.login}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.login}
            />
            <AuthInput
              title={t("login.pass")}
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
            />
            <div className={styles.formPart}>
              <label htmlFor="email">{t("login.rememb")}</label>
              <input type="checkbox" />
            </div>
            <button type="submit" className={styles.formSubmitBtn}>
              {t("login.btn")}
            </button>
            <div className={styles.suggestionBlock}>
              {t("login.not-reg")}{" "}
              <Link to="/registration">{t("login.reg")}</Link>
            </div>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}
