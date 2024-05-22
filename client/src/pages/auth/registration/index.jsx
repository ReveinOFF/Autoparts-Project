import { FormikProvider, useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import AuthInput from "../../../components/auth-input";
import { Link, useNavigate } from "react-router-dom";
import styles from "../login/login.module.css";
import axios from "axios";

export default function Registration() {
  const { t, i18n } = useTranslation();
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
      alert(error?.response?.data?.message || "Error occurred registration");
    }
  };

  const UpdateSchema = Yup.object().shape({
    login: Yup.string()
      .email("Write correct email")
      .required("This field is required")
      .max(30, "Max length is 30 symbols"),
    name: Yup.string()
      .required("This field is required")
      .min(2, "Min length is 2 symbols")
      .max(30, "Max length is 30 symbols"),
    surname: Yup.string()
      .min(2, "Min length is 2 symbols")
      .max(30, "Max length is 30 symbols"),
    password: Yup.string()
      .required("This field is required")
      .min(8, "Min length is 8 symbols")
      .max(30, "Max length is 30 symbols"),
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
            <h2 className={styles.authForm_Name}>Registration</h2>
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
              title="Name:"
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
            />
            <AuthInput
              title="Surname:"
              name="surname"
              type="text"
              value={values.surname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.surname}
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
              Have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}
