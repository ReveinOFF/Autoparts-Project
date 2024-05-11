import styles from "./login.module.css";

export default function AdminLogin() {
  return (
    <div className={styles.block}>
      <h1>Увійти в Панель Адміністратора</h1>
      <form>
        <div className={styles.input_block}>
          <label htmlFor="login">Логін</label>
          <input type="email" name="login" />
        </div>
        <div className={styles.input_block}>
          <label htmlFor="password">Пароль</label>
          <input type="password" name="password" />
        </div>
        <a href="/">Забули пароль?</a>
        <button>Увійти</button>
      </form>
    </div>
  );
}
