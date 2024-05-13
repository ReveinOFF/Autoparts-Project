import axios from "axios";

export class FilesHttp {
  static async uploadFile(formdata) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/files/upload-files`,
      formdata
    );
  }
}
