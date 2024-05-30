import axios from "axios";
import { FormikProvider, useFormik } from "formik";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import styles from "./pass.module.css";
import arrowImg from "../../../assets/images/profile/arrow.svg";
import { useTranslation } from "react-i18next";

export default function Password() {
  const state = useSelector((s) => s.profile);
  const { t } = useTranslation();

  const onHandleSubmitPass = async (formData) => {
    try {
      const { _id } = state._id;

      await axios.put(
        `${process.env.REACT_APP_HOST}/authentication/pass/edit`,
        { ...formData, userId: _id }
      );

      alert(t("profile.pass.succ"));
    } catch (error) {
      console.log(error?.response?.data?.message || t("profile.pass.err"));
      console.log(error);
    }
  };

  const UpdateSchema = Yup.object().shape({
    oldPassword: Yup.string().required(t("validation.req")),
    newPassword: Yup.string()
      .required(t("validation.req"))
      .min(8, t("validation.min8"))
      .max(30, t("validation.max30")),
    newRPassword: Yup.string()
      .required(t("validation.req"))
      .oneOf([Yup.ref("newPassword"), null], t("validation.pass")),
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
      <h1>{t("profile.pass.h1")}</h1>
      <Link to={-1} className={styles.back}>
        <img src={arrowImg} alt="arrow" width={15} />
        <span>{t("profile.pass.back")}</span>
      </Link>
      <FormikProvider value={formik}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="oldPassword">{t("profile.pass.oldpass")}</label>
            <input
              type="password"
              name="oldPassword"
              placeholder={t("profile.pass.oldpass")}
              value={values.oldPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {errors.oldPassword && touched.oldPassword && (
            <p>{errors.oldPassword}</p>
          )}
          <div>
            <label htmlFor="newPassword">{t("profile.pass.newpass")}</label>
            <input
              type="password"
              name="newPassword"
              placeholder={t("profile.pass.newpass")}
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {errors.newPassword && touched.newPassword && (
            <p>{errors.newPassword}</p>
          )}
          <div>
            <label htmlFor="newRPassword">{t("profile.pass.cnewpass")}</label>
            <input
              type="password"
              name="newRPassword"
              placeholder={t("profile.pass.cnewpass")}
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
            {t("profile.pass.btn")}
          </button>
        </form>
      </FormikProvider>
    </>
  );
}
