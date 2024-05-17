import axios from "axios";

export class BrandHttp {
  static async addBrand(payload) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/mark/add-mark`,
      payload
    );
  }

  static async putBrand(payload) {
    return await axios.put(
      `${process.env.REACT_APP_HOST}/mark/put-mark`,
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

  static async delBrand(id) {
    return await axios.delete(
      `${process.env.REACT_APP_HOST}/mark/delete-mark/${id}`
    );
  }

  static async addModel(payload) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/modele/add-modele`,
      payload
    );
  }

  static async putModel(payload) {
    return await axios.put(
      `${process.env.REACT_APP_HOST}/modele/put-modele`,
      payload
    );
  }

  static async getModels() {
    return await axios.get(`${process.env.REACT_APP_HOST}/modele/all-modele`);
  }

  static async getModel(id) {
    return await axios.get(
      `${process.env.REACT_APP_HOST}/modele/one-modele/${id}`
    );
  }

  static async delModele(id) {
    return await axios.delete(
      `${process.env.REACT_APP_HOST}/modele/delete-modele/${id}`
    );
  }

  static async getModelByMark(id) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/modele/modele-mark`,
      id
    );
  }
}
