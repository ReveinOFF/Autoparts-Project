import axios from "axios";

export class BrandHttp {
  static async addBrand(payload) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/brand/add-brand`,
      payload
    );
  }
  static async getBrands() {
    return await axios.get(`${process.env.REACT_APP_HOST}/brand/all-brand`);
  }

  static async addModel(payload) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/brand/add-model`,
      payload
    );
  }
  static async getModels({ id }) {
    return await axios.get(
      `${process.env.REACT_APP_HOST}/brand/all-models-id/${id}`
    );
  }
  static async getAllModels() {
    return await axios.get(`${process.env.REACT_APP_HOST}/brand/all-models`);
  }
}
