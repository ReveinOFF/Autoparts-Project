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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
        title: t("home.t1"),
        subtitle: t("home.st1"),
        img: category1,
      },
      {
        title: t("home.t2"),
        subtitle: t("home.st2"),
        img: category2,
      },
    ],
    [
      {
        title: t("home.t3"),
        subtitle: t("home.st3"),
        img: category1,
      },
      {
        title: t("home.t4"),
        subtitle: t("home.st4"),
        img: category2,
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
        <h1>{t("home.h1")}</h1>
        <hgroup>{t("home.hg")}</hgroup>
        <div className="flex-center">
          <div className={styles.category}>
            <button
              onClick={() => setShowMark(!showMark)}
              className={showMark ? styles.active : ""}
            >
              <span>
                {selectMark.title ? selectMark.title : t("home.smark")}
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
                {selectModel.title ? selectModel.title : t("home.smodel")}
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
            {t("home.search")}
          </button>
        </div>
      </div>
      <div className={`${styles.slider} container`}>
        <div className={styles.title}>
          <h2>
            {t("home.h211")} <span>{t("home.h212")}</span>
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
                    <button>{t("home.show")}</button>
                  </div>
                  <img src={block.img} alt="category" draggable={false} />
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
          {t("home.h221")} <span>{t("home.h222")}</span>
        </h2>
        <div className={styles.category_list}>
          <div className={styles.block_category}>
            <img src={cat1} alt="category" />
            <div className={styles.cat_info}>
              <div className={styles.title}>{t("home.ct1")}</div>
              <div>
                <div>{t("home.sct11")}</div>
                <div>{t("home.sct12")}</div>
                <div>{t("home.sct13")}</div>
              </div>
            </div>
            <a href="/" className={`${styles.link} flex-align`}>
              {t("home.all")} <img src={cat_arrow} alt="arrow" />
            </a>
          </div>
          <div className={styles.block_category}>
            <img src={cat2} alt="category" />
            <div className={styles.cat_info}>
              <div className={styles.title}>{t("home.ct2")}</div>
              <div>
                <div>{t("home.sct21")}</div>
                <div>{t("home.sct22")}</div>
                <div>{t("home.sct23")}</div>
              </div>
            </div>
            <a href="/" className={`${styles.link} flex-align`}>
              {t("home.all")} <img src={cat_arrow} alt="arrow" />
            </a>
          </div>
          <div className={styles.block_category}>
            <img src={cat3} alt="category" />
            <div className={styles.cat_info}>
              <div className={styles.title}>{t("home.ct3")}</div>
              <div>
                <div>{t("home.sct31")}</div>
                <div>{t("home.sct32")}</div>
                <div>{t("home.sct33")}</div>
              </div>
            </div>
            <a href="/" className={`${styles.link} flex-align`}>
              {t("home.all")} <img src={cat_arrow} alt="arrow" />
            </a>
          </div>
          <div className={styles.block_category}>
            <img src={cat4} alt="category" />
            <div className={styles.cat_info}>
              <div className={styles.title}>{t("home.ct4")}</div>
              <div>
                <div>{t("home.sct41")}</div>
                <div>{t("home.sct42")}</div>
                <div>{t("home.sct43")}</div>
              </div>
            </div>
            <a href="/" className={`${styles.link} flex-align`}>
              {t("home.all")} <img src={cat_arrow} alt="arrow" />
            </a>
          </div>
          <div className={styles.block_category}>
            <img src={cat5} alt="category" />
            <div className={styles.cat_info}>
              <div className={styles.title}>{t("home.ct5")}</div>
              <div>
                <div>{t("home.sct51")}</div>
                <div>{t("home.sct52")}</div>
                <div>{t("home.sct53")}</div>
              </div>
            </div>
            <a href="/" className={`${styles.link} flex-align`}>
              {t("home.all")} <img src={cat_arrow} alt="arrow" />
            </a>
          </div>
          <div className={styles.block_category}>
            <img src={cat6} alt="category" />
            <div className={styles.cat_info}>
              <div className={styles.title}>{t("home.ct6")}</div>
              <div>
                <div>{t("home.sct61")}</div>
                <div>{t("home.sct62")}</div>
                <div>{t("home.sct63")}</div>
              </div>
            </div>
            <a href="/" className={`${styles.link} flex-align`}>
              {t("home.all")} <img src={cat_arrow} alt="arrow" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
