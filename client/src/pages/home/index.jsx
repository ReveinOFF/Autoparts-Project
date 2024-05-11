import arrowSVG from "../../assets/images/header/arrowTwo.svg";
import arrowRight from "../../assets/images/main/arrow-right.svg";
import arrowLeft from "../../assets/images/main/arrow_left.svg";
import lineSVG from "../../assets/images/main/line.svg";
import category1 from "../../assets/images/main/category1.png";
import category2 from "../../assets/images/main/category2.png";
import cat1 from "../../assets/images/main/cat1.png";
import cat2 from "../../assets/images/main/cat2.png";
import cat3 from "../../assets/images/main/cat3.png";
import cat4 from "../../assets/images/main/cat4.png";
import cat5 from "../../assets/images/main/cat5.png";
import cat6 from "../../assets/images/main/cat6.png";
import cat_arrow from "../../assets/images/main/cat_arrow.svg";
import styles from "./home.module.css";

export default function Home() {
  return (
    <>
      <div className={styles.top}>
        <h1>Обирай найкращі деталі</h1>
        <hgroup>Маємо більше ніж 100 000 запчастин</hgroup>
        <div className="flex-center">
          <div className={styles.category}>
            <span>Виберіть марку</span>
            <img src={arrowSVG} alt="" />
          </div>
          <div className={styles.category}>
            <span>Виберіть модель</span>
            <img src={arrowSVG} alt="" />
          </div>
          <div className={styles.category}>
            <span>Виберіть категорію</span>
            <img src={arrowSVG} alt="" />
          </div>
        </div>
      </div>
      <div className={`${styles.slider} container`}>
        <div className={styles.title}>
          <h2>
            ПОПУЛЯРНІ <span>КОЛЕКЦІЇ</span>
          </h2>
          <div>
            <img src={arrowLeft} alt="arrow left" width={15} height={20} />
            <img src={lineSVG} alt="center line" width={15} height={20} />
            <img src={arrowRight} alt="arrow right" width={15} height={20} />
          </div>
        </div>
        <div className={styles.slider_block}>
          <div>
            <div className={styles.slider_info}>
              <div>ТО & Фільтра</div>
              <div>Супер ціни</div>
              <button>Переглянути</button>
            </div>
            <img src={category1} alt="category" />
          </div>
          <div>
            <img src={category2} alt="category" />
          </div>
        </div>
        <div className={styles.pages_block}>
          <div className={styles.pages_slide}></div>
          <div className={styles.pages_slide}></div>
          <div className={styles.pages_slide}></div>
          <div className={styles.pages_slide}></div>
        </div>
      </div>
      <div className={`${styles.bot_category} container`}>
        <h2 className={styles.title}>
          ОСНОВНІ <span>КАТЕГОРІЇ</span>
        </h2>
        <div className={styles.category_list}>
          <div className={styles.block_category}>
            <img src={cat1} alt="category" />
            <div className={styles.cat_info}>
              <div className={styles.title}>Кузов</div>
              <div>
                <div>Внутрішні частини</div>
                <div>Зовнішні частини</div>
                <div>Система склоочисника</div>
              </div>
            </div>
            <a href="/" className={`${styles.link} flex-align`}>
              Показати всі <img src={cat_arrow} alt="arrow" />
            </a>
          </div>
          <div className={styles.block_category}>
            <img src={cat2} alt="category" />
            <div className={styles.cat_info}>
              <div className={styles.title}>Електр. частина</div>
              <div>
                <div>Аудіо</div>
                <div>Електрика</div>
                <div>Запалювання</div>
              </div>
            </div>
            <a href="/" className={`${styles.link} flex-align`}>
              Показати всі <img src={cat_arrow} alt="arrow" />
            </a>
          </div>
          <div className={styles.block_category}>
            <img src={cat3} alt="category" />
            <div className={styles.cat_info}>
              <div className={styles.title}>Освітлення</div>
              <div>
                <div>Протитуманна фара</div>
                <div>Задній ліхтар</div>
                <div>Лампа ближ. світла</div>
              </div>
            </div>
            <a href="/" className={`${styles.link} flex-align`}>
              Показати всі <img src={cat_arrow} alt="arrow" />
            </a>
          </div>
          <div className={styles.block_category}>
            <img src={cat4} alt="category" />
            <div className={styles.cat_info}>
              <div className={styles.title}>Деталі двигуна</div>
              <div>
                <div>Гідрокомпенсатори</div>
                <div>Маслянний піддон</div>
                <div>Поршень</div>
              </div>
            </div>
            <a href="/" className={`${styles.link} flex-align`}>
              Показати всі <img src={cat_arrow} alt="arrow" />
            </a>
          </div>
          <div className={styles.block_category}>
            <img src={cat5} alt="category" />
            <div className={styles.cat_info}>
              <div className={styles.title}>Розхідники ТО</div>
              <div>
                <div>Комплект ГРМ</div>
                <div>Свічка запалювання</div>
                <div>Гальмувальні колодки</div>
              </div>
            </div>
            <a href="/" className={`${styles.link} flex-align`}>
              Показати всі <img src={cat_arrow} alt="arrow" />
            </a>
          </div>
          <div className={styles.block_category}>
            <img src={cat6} alt="category" />
            <div className={styles.cat_info}>
              <div className={styles.title}>Колеса та шини</div>
              <div>
                <div>Диски</div>
                <div>Ковпаки</div>
                <div>Резина</div>
              </div>
            </div>
            <a href="/" className={`${styles.link} flex-align`}>
              Показати всі <img src={cat_arrow} alt="arrow" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
