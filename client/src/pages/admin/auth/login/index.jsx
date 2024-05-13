import { FormikProvider, useFormik } from "formik";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AUTH_USER_ACTION } from "../../../../reducers/authReducer";

export default function AdminLogin() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onHandleSubmit = async (formData) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_HOST}/authentication/admin-login`,
        formData
      );
      localStorage.setItem("token", data?.token);
      dispatch({ type: AUTH_USER_ACTION, payload: { isAuth: true } });
      navigate("/admin/edit");
    } catch (error) {
      alert(error?.response?.data?.message || "Error occurred login");
    }
  };

  const UpdateSchema = Yup.object().shape({
    login: Yup.string()
      .email("Write correct email")
      .required("This field is required")
      .max(30, "Max length is 30 symbols"),
    password: Yup.string()
      .required("This field is required")
      .min(8, "Min length is 8 symbols")
      .max(30, "Max length is 30 symbols"),
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
    <div className={styles.block}>
      <h1>Увійти в Панель Адміністратора</h1>
      <FormikProvider value={formik}>
        <form onSubmit={handleSubmit}>
          <div className={styles.input_block}>
            <label htmlFor="login">Логін</label>
            <input
              type="email"
              name="login"
              value={values.login}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className={styles.input_block}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <a href="/">Забули пароль?</a>
          <button>Увійти</button>
        </form>
      </FormikProvider>
    </div>
  );
}
