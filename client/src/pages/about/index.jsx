import styles from "./about.module.css";

export default function About() {
  return (
    <div className="container">
      <h1 className={styles.h1}>О нас</h1>
      {/* <div
        className={styles.info}
        dangerouslySetInnerHTML={{ __html: ConvertJsonToHtml() }}
      ></div> */}
    </div>
  );
}
