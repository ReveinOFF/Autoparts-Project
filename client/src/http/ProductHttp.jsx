import axios from "axios";

export class ProductHttp {
  static async addProduct(payload) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/product/add-product`,
      payload
    );
  }

  static async putProduct(payload) {
    return await axios.put(
      `${process.env.REACT_APP_HOST}/product/put-product`,
      payload
    );
  }

  static async getProducts(payload) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/product/all-product`,
      payload
    );
  }

  static async getProduct(id) {
    return await axios.get(
      `${process.env.REACT_APP_HOST}/product/get-product/${id}`
    );
  }

  static async findAllProductsById(ids) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/product/all-product-by-id`,
      ids
    );
  }
}
