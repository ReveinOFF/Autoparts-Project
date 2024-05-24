import axios from "axios";
import { FormikProvider, useFormik } from "formik";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import styles from "./pass.module.css";
import arrowImg from "../../../assets/images/profile/arrow.svg";

export default function Password() {
  const state = useSelector((s) => s.profile);

  const onHandleSubmitPass = async (formData) => {
    try {
      const { _id } = state._id;

      await axios.put(
        `${process.env.REACT_APP_HOST}/authentication/pass/edit`,
        { ...formData, userId: _id }
      );

      alert("Password update!");
    } catch (error) {
      console.log(error?.response?.data?.message || "Error occurred login");
      console.log(error);
    }
  };

  const UpdateSchema = Yup.object().shape({
    oldPassword: Yup.string().required("This field is required"),
    newPassword: Yup.string()
      .required("This field is required")
      .min(8, "Min length is 8 symbols")
      .max(30, "Max length is 30 symbols"),
    newRPassword: Yup.string()
      .required("This field is required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    newRPassword: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: UpdateSchema,
    onSubmit: onHandleSubmitPass,
    validateOnChange: true,
  });

  const { values, handleChange, handleSubmit, touched, errors, handleBlur } =
    formik;

  return (
    <>
      <h1>Змінити пароль</h1>
      <Link to={-1} className={styles.back}>
        <img src={arrowImg} alt="arrow" width={15} />
        <span>Назад</span>
      </Link>
      <FormikProvider value={formik}>
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
            disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
          >
            Змінити
          </button>
        </form>
      </FormikProvider>
    </>
  );
}
