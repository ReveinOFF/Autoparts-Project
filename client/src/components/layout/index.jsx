import { Outlet, useLocation } from "react-router-dom";
import Header from "../header";
import Footer from "../footer";

export default function Layout() {
  const location = useLocation();

  return (
    <>
      <Header />
      <main
        style={{
          backgroundColor: location.pathname.includes("profile")
            ? "#DFDFDF"
            : "#FFFFFF",
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
