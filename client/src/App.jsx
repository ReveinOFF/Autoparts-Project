import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Layout from "./components/layout";
import About from "./pages/about";
import Login from "./pages/auth/login";
import Registration from "./pages/auth/registration";
import AdminLayout from "./components/admin/layout";
import AdminLogin from "./pages/admin/auth/login";
import Favourites from "./pages/favourites";
import {
  BlockAdminRoute,
  BlockRoute,
  PrivateAdminRoute,
  PrivateRoute,
} from "./components/private-route/privateRoute";
import Product from "./pages/product";
import LeftLayout from "./components/admin/left-layout";
import AdminHome from "./pages/admin/home";
import AdminCategory from "./pages/admin/category";
import ExportImport from "./pages/admin/export";
import AdminProduct from "./pages/admin/product";
import LangAdmin from "./pages/admin/lang";
import AdminCourse from "./pages/admin/course";
import AdminSetting from "./pages/admin/settings";
import AdminMark from "./pages/admin/mark";
import AdminPages from "./pages/admin/pages";
import AddCategory from "./pages/admin/addCategory";
import AddProduct from "./pages/admin/addProduct";
import AddMark from "./pages/admin/addMark";
import AddModel from "./pages/admin/addModel";
import OrderInfo from "./pages/order-info";
import Privacy from "./pages/privacy";
import Contact from "./pages/contact";
import ReturnGoods from "./pages/return-goods";
import ProfileLayout from "./components/profile-layout";
import Profile from "./pages/profile/main";
import OrdersP from "./pages/profile/orders";
import RecallP from "./pages/profile/recall";
import FavoritesP from "./pages/profile/favorites";
import Password from "./pages/profile/password";
import ScrollToTop from "./components/scrollTop";
import CartP from "./pages/profile/cart";
import Checkout from "./pages/checkout";
import Categories from "./pages/categories";
import SCProducts from "./pages/SCProducts";
import SProducts from "./pages/SProducts";
import SubCategories from "./pages/subcategories";
import AdminSubCategory from "./pages/admin/subcategory";
import AddSubCat from "./pages/admin/addSubCat";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DATA_CURR_ACTION } from "./reducers/currReducer";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("course"))
      dispatch({
        type: DATA_CURR_ACTION,
        payload: JSON.parse(localStorage.getItem("course")),
      });
  }, []);
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="order-info" element={<OrderInfo />} />
          <Route path="privacy" element={<Privacy />} />
          <Route
            path="favourites"
            element={
              <BlockRoute>
                <Favourites />
              </BlockRoute>
            }
          />
          <Route path="contact" element={<Contact />} />
          <Route path="return-goods" element={<ReturnGoods />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="sc/products/:id" element={<SCProducts />} />
          <Route path="categories/:id" element={<Categories />} />
          <Route path="subcategories/:id" element={<SubCategories />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="s/products/:id" element={<SProducts />} />

          <Route
            path="profile"
            element={
              <PrivateRoute>
                <ProfileLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Profile />} />
            <Route path="orders" element={<OrdersP />} />
            <Route path="password" element={<Password />} />
            <Route path="favourites" element={<FavoritesP />} />
            <Route path="cart" element={<CartP />} />
            <Route path="recall" element={<RecallP />} />
          </Route>

          <Route
            path="login"
            element={
              <BlockRoute>
                <Login />
              </BlockRoute>
            }
          />
          <Route
            path="registration"
            element={
              <BlockRoute>
                <Registration />
              </BlockRoute>
            }
          />
        </Route>

        <Route path="admin" element={<AdminLayout />}>
          <Route
            path="login"
            element={
              <BlockAdminRoute>
                <AdminLogin />
              </BlockAdminRoute>
            }
          />
          <Route
            path="edit"
            element={
              <PrivateAdminRoute>
                <LeftLayout />
              </PrivateAdminRoute>
            }
          >
            <Route path="home" element={<AdminHome />} />
            <Route path="category" element={<AdminCategory />} />
            <Route path="category/:id" element={<AddCategory />} />
            <Route path="subcategory" element={<AdminSubCategory />} />
            <Route path="subcategory/:id" element={<AddSubCat />} />
            <Route path="exp" element={<ExportImport />} />
            <Route path="products" element={<AdminProduct />} />
            <Route path="products/:id" element={<AddProduct />} />
            <Route path="lang" element={<LangAdmin />} />
            <Route path="curr" element={<AdminCourse />} />
            <Route path="setting" element={<AdminSetting />} />
            <Route path="mark" element={<AdminMark />} />
            <Route path="mark/mk/:id" element={<AddMark />} />
            <Route path="mark/ml/:id" element={<AddModel />} />
            <Route path="pages" element={<AdminPages />} />
          </Route>
          <Route index element={<Navigate to="edit" />} />
        </Route>
      </Routes>
    </>
  );
}
