import axios from "axios";

export class BrandHttp {
  static async addBrand(payload) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/brand/add-brand`,
      payload
    );
  }

  static async getBrands() {
    return await axios.get(`${process.env.REACT_APP_HOST}/mark/all-mark`);
  }

  static async getBrand(id) {
    return await axios.get(`${process.env.REACT_APP_HOST}/mark/one-mark/${id}`);
  }

  static async getBrandByCat(id) {
    return await axios.post(`${process.env.REACT_APP_HOST}/mark/mark-cat`, id);
  }

  static async addModel(payload) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/brand/add-model`,
      payload
    );
  }

  static async getModels() {
    return await axios.get(`${process.env.REACT_APP_HOST}/modele/all-modele`);
  }

  static async getModelByMark(id) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/modele/modele-mark`,
      id
    );
  }

  static async getAllModels() {
    return await axios.get(`${process.env.REACT_APP_HOST}/brand/all-models`);
  }
}
