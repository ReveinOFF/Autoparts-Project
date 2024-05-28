import { useParams, useSearchParams } from "react-router-dom";
import arrowPage from "../../assets/images/main/arrow_page.svg";
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

export default function SProducts() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
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

      setData(res.data);
      setProductsVis(res.data?.products);
    }
  };

  useEffect(() => {
    findProd();
  }, [currPage]);

  return (
    <div className="container" style={{ marginBottom: 60 }}>
      {showCart && (
        <div className="cart_modal">
          <Cart onClose={() => setShowCart(false)} />
        </div>
      )}
      <div className="pages" style={{ marginBottom: 30 }}>
        {searchParams
          ?.get("pages")
          ?.split("/")
          ?.map((item, index, array) => (
            <>
              <div key={index}>{item}</div>
              {index !== array.length - 1 && (
                <img
                  key={`arrow-${index}`}
                  src={arrowPage}
                  alt="arrow page"
                  width={10}
                />
              )}
            </>
          ))}
      </div>
      <ProductsComponent
        data={productsVis}
        pages={`?pages=${searchParams?.get("pages")}`}
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
