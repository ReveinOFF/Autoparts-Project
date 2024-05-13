import axios from "axios";

export class NodeHttp {
  static async addNodeToGraph(payload) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/structure-routes/add-node-graph`,
      payload
    );
  }

  static async addProductNodeToGraph(payload) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/structure-routes/add-product-node-graph`,
      payload
    );
  }

  static async getNodesInGraph(id) {
    return await axios.get(
      `${process.env.REACT_APP_HOST}/structure-routes/get-nodes-graph/${id}`
    );
  }

  static async getMainParentNodes(payload) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/structure-routes/get-main-parent-nodes`,
      payload
    );
  }
}
