import { Outlet } from "react-router-dom";
import AdminHeader from "../header";

export default function AdminLayout() {
  return (
    <>
      <AdminHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
}
