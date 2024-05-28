import { useParams } from "react-router-dom";
import arrowPage from "../../assets/images/main/arrow_page.svg";

export default function SProducts() {
  const { id } = useParams();

  return (
    <div className="container">
      <div className="pages">
        <div>Audi</div>
        <img src={arrowPage} alt="arrow page" width={10} />
        <div>A6</div>
        <img src={arrowPage} alt="arrow page" width={10} />
        <div>Зовнішні елементи</div>
        <img src={arrowPage} alt="arrow page" width={10} />
        <div>Капот</div>
        <img src={arrowPage} alt="arrow page" width={10} />
        <div>Капот Audi A6</div>
      </div>
      {/* <ProductsComponent
        data={productsVis}
        removeFav={remToFav}
        addFav={addToFav}
        addToCart={addToCart}
      /> */}
    </div>
  );
}
