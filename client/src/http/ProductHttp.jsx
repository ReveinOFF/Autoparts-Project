import axios from "axios";

export class ProductHttp {
  static async addProduct(payload) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/product/add-product`,
      payload
    );
  }

  static async getProduct(filter) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/product/all-product`,
      filter
    );
  }

  static async findAllProductsById(ids) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/product/all-product-by-id`,
      ids
    );
  }
}
