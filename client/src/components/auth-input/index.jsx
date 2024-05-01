import styles from "./auth-input.module.css";

export default function AuthInput({
  title,
  name,
  type,
  value,
  onChange,
  onBlur,
  error,
}) {
  return (
    <div className={styles.formPart}>
      <label htmlFor="login">{title}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={error && styles.error}
      />
      {error && <div>{error}</div>}
    </div>
  );
}
