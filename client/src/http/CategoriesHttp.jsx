import axios from "axios";

export class CategoriesHttp {
  static async addCategories(payload) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/categories/add-categories`,
      payload
    );
  }
  static async getCategories() {
    return await axios.get(
      `${process.env.REACT_APP_HOST}/categories/all-categories`
    );
  }
}
