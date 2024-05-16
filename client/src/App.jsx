import { Route, Routes } from "react-router-dom";
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="favourites" element={<Favourites />} />
        <Route path="product" element={<Product />} />

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
          <Route path="exp" element={<ExportImport />} />
          <Route path="products" element={<AdminProduct />} />
          <Route path="products/:id" element={<AddProduct />} />
          <Route path="lang" element={<LangAdmin />} />
          <Route path="curr" element={<AdminCourse />} />
          <Route path="setting" element={<AdminSetting />} />
          <Route path="mark" element={<AdminMark />} />
          <Route path="pages" element={<AdminPages />} />
        </Route>
      </Route>
    </Routes>
  );
}
