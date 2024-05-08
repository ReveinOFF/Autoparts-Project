import { Link, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { FormikProvider, useFormik } from "formik";
import AuthInput from "../../../components/auth-input";
import axios from "axios";

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const onHandleSubmit = async (formData) => {
    console.log(process.env.REACT_APP_HOST);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_HOST}/authentication/login`,
        formData
      );
      localStorage.setItem("token", data?.token);
      navigate("/");
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
    <div className={styles.login}>
      <div className="container">
        <FormikProvider value={formik}>
          <form onSubmit={handleSubmit}>
            <h2 className={styles.authForm_Name}>Login</h2>
            <AuthInput
              title="Email:"
              name="login"
              type="email"
              value={values.login}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.login}
            />
            <AuthInput
              title="Password:"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
            />
            <div className={styles.formPart}>
              <label htmlFor="email">Remember Me</label>
              <input type="checkbox" />
            </div>
            <button type="submit" className={styles.formSubmitBtn}>
              Submit
            </button>
            <div className={styles.suggestionBlock}>
              Don't have an account? <Link to="/registration">Register</Link>
            </div>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}
