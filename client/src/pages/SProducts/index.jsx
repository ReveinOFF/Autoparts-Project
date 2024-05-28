import { useParams } from "react-router-dom";
import arrowPage from "../../assets/images/main/arrow_page.svg";

export default function SProducts() {
  const { id } = useParams();
  return (
    <div className="container">
      <div className="pages">
        <a href="/">Audi</a>
        <img src={arrowPage} alt="arrow page" width={10} />
        <a href="/">A6</a>
        <img src={arrowPage} alt="arrow page" width={10} />
        <a href="/">Зовнішні елементи</a>
        <img src={arrowPage} alt="arrow page" width={10} />
        <a href="/">Капот</a>
        <img src={arrowPage} alt="arrow page" width={10} />
        <div href="/">Капот Audi A6</div>
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
