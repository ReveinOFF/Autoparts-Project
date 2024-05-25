import { useNavigate } from "react-router-dom";
import Cart from "../../../components/cart";

export default function CartP() {
  const navigate = useNavigate();
  return (
    <Cart
      onClose={() => navigate(-1)}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
