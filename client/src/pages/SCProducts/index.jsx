import { useParams, useSearchParams } from "react-router-dom";
import styles from "./scproducts.module.css";
import { useEffect, useState } from "react";
import arrowSVG from "../../assets/images/header/arrowTwo.svg";
import axios from "axios";
import ProductsComponent from "../../components/products";
import { isSaved, removeFavItem, updateFavData } from "../../utils/fovourite";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Cart from "../../components/cart";
import { SET_CART } from "../../reducers/cartReducer";
import { updateCartData } from "../../utils/cart";
import Pagination from "../../components/pagination";

export default function SCProducts() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [showMark, setShowMark] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [dataMark, setDataMark] = useState([]);
  const [selectMark, setSelectMark] = useState({});
  const [selectModel, setSelectModel] = useState({});
  const [dataModel, setDataModel] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [currPage, setCurrPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const [productsVis, setProductsVis] = useState([]);
  const { isAuth } = useSelector((s) => s.auth);

  const addToFav = async (item) => {
    updateFavData(item);
    setProductsVis((prev) => {
      return prev.map((product) => {
        if (product._id === item) {
          return { ...product, isFav: true };
        }
        return product;
      });
    });

    if (isAuth) {
      const token = localStorage.getItem("token");

      const { _id } = jwtDecode(token);

      await axios.post(`${process.env.REACT_APP_HOST}/authentication/fav/add`, {
        _id: _id,
        saveProductId: item,
      });
    }
  };

  const remToFav = async (item) => {
    removeFavItem(item);
    setProductsVis((prev) => {
      return prev.map((product) => {
        if (product._id === item) {
          return { ...product, isFav: false };
        }
        return product;
      });
    });

    if (isAuth) {
      const token = localStorage.getItem("token");

      const { _id } = jwtDecode(token);

      await axios.delete(
        `${process.env.REACT_APP_HOST}/authentication/fav/del/${_id}/${item}`
      );
    }
  };

  const addToCart = (item) => {
    updateCartData({
      id: item?._id,
      image: item?.image[0],
      title: item?.title,
      count: 1,
      price: item?.price,
      mainPrice: item?.price,
    });
    setShowCart(true);
    dispatch({ type: SET_CART });
  };

  const findProd = async () => {
    if (isAuth) {
      const token = localStorage.getItem("token");

      const jwt = jwtDecode(token);

      const res = await axios.get(
        `${process.env.REACT_APP_HOST}/subcategories/get-one/${id}/${
          jwt._id
        }?page=${currPage || parseInt(searchParams.get("page")) || 1}`
      );

      setDataMark(res.data?.marks);
      setData(res.data);
      setProductsVis(res.data?.products);
    } else {
      const res = await axios.get(
        `${process.env.REACT_APP_HOST}/subcategories/get-one/${id}?page=${
          currPage || parseInt(searchParams.get("page")) || 1
        }`
      );
      let tempData = res.data;

      if (isSaved(res?.data?.id)) tempData.isFav = true;
      else tempData.isFav = false;

      setDataMark(res.data?.marks);
      setData(res.data);
      setProductsVis(res.data?.products);
    }
  };

  useEffect(() => {
    findProd();
  }, [currPage]);

  const findModal = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_HOST}/modele/m-modele-mark/${selectMark._id}`
    );

    setDataModel(res.data);
  };

  useEffect(() => {
    if (selectMark?._id) findModal();
  }, [selectMark]);

  const findProdModel = async () => {
    if (selectMark?.title && selectModel?.title) {
      if (isAuth) {
        const token = localStorage.getItem("token");

        const jwt = jwtDecode(token);

        const res = await axios.get(
          `${process.env.REACT_APP_HOST}/subcategories/get-one/${id}/${
            selectModel._id
          }/${jwt._id}?page=${
            currPage || parseInt(searchParams.get("page")) || 1
          }`
        );

        setDataMark(res.data?.marks);
        setData(res.data);
        setProductsVis(res.data?.products);
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_HOST}/subcategories/get-one-mod/${id}/:${
            selectModel._id
          }?page=${currPage || parseInt(searchParams.get("page")) || 1}`
        );
        let tempData = res.data;

        if (isSaved(res?.data?.id)) tempData.isFav = true;
        else tempData.isFav = false;

        setDataMark(res.data?.marks);
        setData(res.data);
        setProductsVis(res.data?.products);
      }
    }
  };

  return (
    <div className="container" style={{ marginBlock: 40 }}>
      {showCart && (
        <div className="cart_modal">
          <Cart onClose={() => setShowCart(false)} />
        </div>
      )}
      <div className={styles.info}>
        <hgroup>{searchParams.get("t1")}</hgroup>
        <h1>{searchParams.get("t2")}</h1>
      </div>
      <div className={styles.selector}>
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
            className={`${styles.top_select} ${showMark ? styles.active : ""}`}
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
            className={`${styles.top_select} ${showModel ? styles.active : ""}`}
          >
            {dataModel?.map((item) => (
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
        <button className={styles.cat_btn} onClick={findProdModel}>
          Пошук
        </button>
      </div>
      <ProductsComponent
        data={productsVis}
        removeFav={remToFav}
        addFav={addToFav}
        addToCart={addToCart}
      />
      {data.totalPages > 1 && (
        <Pagination
          currPage={currPage}
          totalPage={data.totalPages}
          onChangePage={(page) => setCurrPage(page)}
        />
      )}
      {productsVis.length < 1 && <u>Пусто</u>}
    </div>
  );
}
