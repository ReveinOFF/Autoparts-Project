import noImg from "../../assets/images/noimg.png";

export default function Image({ src }) {
  return src?.length > 3 ? <img src={src} /> : <img src={noImg} />;
}
