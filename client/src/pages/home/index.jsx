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
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [showMark, setShowMark] = useState();
  const [showModel, setShowModel] = useState();
  const [dataMark, setDataMark] = useState([]);
  const [selectMark, setSelectMark] = useState({});
  const [selectModel, setSelectModel] = useState({});
  const [dataModel, setDataModel] = useState([]);
  const [sDataModel, setSDataModel] = useState([]);
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const sliderRef = useRef(null);

  const getMark = async () => {
    const res = await axios.get(`${process.env.REACT_APP_HOST}/mark/all-mark`);

    setDataMark(res.data);
  };

  const getModel = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_HOST}/modele/all-modele`
    );

    setDataModel(res.data);
    setSDataModel(res.data);
  };

  useEffect(() => {
    getMark();
    getModel();
  }, []);

  useEffect(() => {
    setSDataModel(
      dataModel?.filter((item) => item?.markIds?.includes(selectMark?._id))
    );
  }, [selectMark]);

  const findCat = () => {
    if (selectMark.title && selectModel.title)
      navigate(
        `/categories/${selectModel._id}?pages=${selectMark.title}/${selectModel.title}`
      );
  };

  const pages = [
    [
      {
        title: "ТО & Фільтра",
        subtitle: "Супер ціни",
        img: category1,
      },
      {
        title: "Запчастини двигуна",
        subtitle: "Будь-які",
        img: category1,
      },
    ],
    [
      {
        title: "Електрика та освітлення",
        subtitle: "Супер ціни",
        img: category1,
      },
      {
        title: "Кузов і складові",
        subtitle: "Нові надходження",
        img: category1,
      },
    ],
  ];

  const handleNext = () => {
    setPageIndex((prev) => (prev + 1) % 2);
  };

  const handlePrev = () => {
    setPageIndex((prev) => (prev - 1 + 2) % 2);
  };

  const handlePageClick = (index) => {
    setPageIndex(index);
  };

  const handleTouchStart = (e) => {
    sliderRef.current.startX = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!sliderRef.current.startX) return;
    const diffX = e.touches[0].clientX - sliderRef.current.startX;
    if (diffX > 50) {
      handlePrev();
      sliderRef.current.startX = null;
    } else if (diffX < -50) {
      handleNext();
      sliderRef.current.startX = null;
    }
  };

  const handleMouseDown = (e) => {
    sliderRef.current.startX = e.clientX;
  };

  const handleMouseUp = (e) => {
    if (!sliderRef.current.startX) return;
    const diffX = e.clientX - sliderRef.current.startX;
    if (diffX > 50) {
      handlePrev();
      sliderRef.current.startX = null;
    } else if (diffX < -50) {
      handleNext();
      sliderRef.current.startX = null;
    }
  };

  return (
    <>
      <div className={styles.top}>
        <h1>Обирай найкращі деталі</h1>
        <hgroup>Маємо більше ніж 100 000 запчастин</hgroup>
        <div className="flex-center">
          <div className={styles.category}>
            <button
              onClick={() => setShowMark(!showMark)}
              className={showMark ? styles.active : ""}
            >
              <span>
                {selectMark.title ? selectMark.title : "Виберіть марку"}
              </span>
              <img src={arrowSVG} alt="arrow" />
            </button>
            <div
              className={`${styles.top_select} ${
                showMark ? styles.active : ""
              }`}
            >
              {dataMark?.map((item) => (
                <button
                  onClick={() => {
                    setSelectMark(item);
                    setShowMark(false);
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.category}>
            <button
              onClick={() => {
                if (selectMark?.title) setShowModel(!showModel);
              }}
              className={showModel ? styles.active : ""}
              style={{
                cursor: selectMark?.title ? "pointer" : "not-allowed",
              }}
            >
              <span>
                {selectModel.title ? selectModel.title : "Виберіть модель"}
              </span>
              <img src={arrowSVG} alt="arrow" />
            </button>
            <div
              className={`${styles.top_select} ${
                showModel ? styles.active : ""
              }`}
            >
              {sDataModel?.map((item) => (
                <button
                  onClick={() => {
                    setSelectModel(item);
                    setShowModel(false);
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
          <button className={styles.cat_btn} onClick={findCat}>
            Пошук
          </button>
        </div>
      </div>
      <div className={`${styles.slider} container`}>
        <div className={styles.title}>
          <h2>
            ПОПУЛЯРНІ <span>КОЛЕКЦІЇ</span>
          </h2>
          <div>
            <img
              src={arrowLeft}
              alt="arrow left"
              width={15}
              height={20}
              onClick={handlePrev}
              style={{ cursor: "pointer" }}
            />
            <img src={lineSVG} alt="center line" width={15} height={20} />
            <img
              src={arrowRight}
              alt="arrow right"
              width={15}
              height={20}
              onClick={handleNext}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <div
          className={styles.slider_block}
          style={{ transform: `translateX(-${pageIndex * 50}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          ref={sliderRef}
        >
          {pages.map((page, pageIndex) => (
            <div key={pageIndex}>
              {page.map((block, blockIndex) => (
                <div key={blockIndex}>
                  <div className={styles.slider_info}>
                    <div>{block.title}</div>
                    <div>{block.subtitle}</div>
                    <button>Переглянути</button>
                  </div>
                  <img src={block.img} alt="category" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.pages_block}>
          {pages.map((_, index) => (
            <div
              key={index}
              className={
                index === pageIndex ? styles.pages_slide : styles.pages_unslide
              }
              onClick={() => handlePageClick(index)}
            ></div>
          ))}
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
