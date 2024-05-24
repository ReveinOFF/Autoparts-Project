import noImg from "../../assets/images/noimg.png";

export default function Image({ src, ...restProps }) {
  return src?.length > 3 ? (
    <img src={src} {...restProps} />
  ) : (
    <img src={noImg} {...restProps} />
  );
}
