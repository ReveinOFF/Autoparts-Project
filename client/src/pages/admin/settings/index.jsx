import { FormikProvider, useFormik } from "formik";
import styles from "./setting.module.css";
import * as Yup from "yup";
import axios from "axios";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function AdminSetting() {
  const getUser = async () => {
    const { _id } = await jwtDecode(localStorage.getItem("token"));

    const res = await axios.get(
      `${process.env.REACT_APP_HOST}/authentication/user/${_id}`
    );

    const arr = Object.entries(res.data).map(([key, value]) => ({
      [key]: value,
    }));

    let data = {};
    for (const key in res.data) {
      if (res.data.hasOwnProperty(key)) {
        data[key] = res.data[key];
        if (Object.keys(initialValues).includes(key)) {
          setFieldValue(key, res.data[key]);
          validateField(key);
        }
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const onHandleSubmitUser = async (formData) => {
    try {
      const { _id } = await jwtDecode(localStorage.getItem("token"));

      await axios.put(
        `${process.env.REACT_APP_HOST}/authentication/user/edit`,
        { ...formData, userId: _id }
      );

      window.location.reload();
    } catch (error) {
      alert(error?.response?.data?.message || "Error occurred login");
    }
  };

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

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
    phone: Yup.string()
      .required("This field is required")
      .matches(phoneRegExp, "Phone number is not valid"),
    address: Yup.string().required("This field is required"),
  });

  const initialValues = {
    login: "",
    name: "",
    surname: "",
    phone: "",
    address: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: UpdateSchema,
    onSubmit: onHandleSubmitUser,
    validateOnChange: true,
  });

  const {
    values: values1,
    handleChange: handleChange1,
    handleSubmit: handleSubmit1,
    setFieldValue,
    validateField,
    errors: errors1,
    handleBlur: handleBlur1,
  } = formik;

  const onHandleSubmitPass = async (formData) => {
    try {
      const { _id } = await jwtDecode(localStorage.getItem("token"));

      await axios.put(
        `${process.env.REACT_APP_HOST}/authentication/pass/edit`,
        { ...formData, userId: _id }
      );

      resetForm();
      alert("Password update!");
    } catch (error) {
      console.log(error?.response?.data?.message || "Error occurred login");
      console.log(error);
    }
  };

  const UpdateSchema2 = Yup.object().shape({
    oldPassword: Yup.string().required("This field is required"),
    newPassword: Yup.string()
      .required("This field is required")
      .min(8, "Min length is 8 symbols")
      .max(30, "Max length is 30 symbols"),
    newRPassword: Yup.string()
      .required("This field is required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const initialValues2 = {
    oldPassword: "",
    newPassword: "",
    newRPassword: "",
  };

  const formik2 = useFormik({
    initialValues: initialValues2,
    validationSchema: UpdateSchema2,
    onSubmit: onHandleSubmitPass,
    validateOnChange: true,
  });

  const {
    values,
    handleChange,
    handleSubmit,
    resetForm,
    touched,
    errors,
    handleBlur,
  } = formik2;

  return (
    <div className="container_a">
      <h1 className={styles.h1}>Змінити профіль</h1>
      <FormikProvider value={formik}>
        <form onSubmit={handleSubmit1} className={styles.form}>
          <div>
            <label htmlFor="login">Логін</label>
            <input
              type="email"
              name="login"
              placeholder="Логін"
              value={values1.login}
              onChange={handleChange1}
              onBlur={handleBlur1}
            />
          </div>
          {errors1.login && <p>{errors1.login}</p>}
          <div>
            <label htmlFor="name">Ім'я</label>
            <input
              type="text"
              name="name"
              placeholder="Ім'я"
              value={values1.name}
              onChange={handleChange1}
              onBlur={handleBlur1}
            />
          </div>
          {errors1.name && <p>{errors1.name}</p>}
          <div>
            <label htmlFor="surname">Призвіще</label>
            <input
              type="text"
              name="surname"
              placeholder="Призвіще"
              value={values1.surname}
              onChange={handleChange1}
              onBlur={handleBlur1}
            />
          </div>
          {errors1.surname && <p>{errors1.surname}</p>}
          <div>
            <label htmlFor="phone">Телефон</label>
            <input
              type="tel"
              name="phone"
              placeholder="Телефон"
              value={values1.phone}
              onChange={handleChange1}
              onBlur={handleBlur1}
            />
          </div>
          {errors1.phone && <p>{errors1.phone}</p>}
          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
          >
            Змінити
          </button>
        </form>
      </FormikProvider>

      <h1 className={styles.h1}>Змінити пароль</h1>
      <FormikProvider value={formik2}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="oldPassword">Старий пароль</label>
            <input
              type="password"
              name="oldPassword"
              placeholder="Старий пароль"
              value={values.oldPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {errors.oldPassword && touched.oldPassword && (
            <p>{errors.oldPassword}</p>
          )}
          <div>
            <label htmlFor="newPassword">Новий пароль</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Новий пароль"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {errors.newPassword && touched.newPassword && (
            <p>{errors.newPassword}</p>
          )}
          <div>
            <label htmlFor="newRPassword">Повторити новий пароль</label>
            <input
              type="password"
              name="newRPassword"
              placeholder="Повторити новий пароль"
              value={values.newRPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {errors.newRPassword && touched.newRPassword && (
            <p>{errors.newRPassword}</p>
          )}
          <button
            type="submit"
            disabled={
              formik2.isSubmitting || !formik2.dirty || !formik2.isValid
            }
          >
            Змінити
          </button>
        </form>
      </FormikProvider>
    </div>
  );
}
