import axios from "axios";

export class FilesHttp {
  static async uploadFile(files) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/files/upload-files`,
      files
    );
  }
}
