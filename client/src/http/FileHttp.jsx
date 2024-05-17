import axios from "axios";

export class FilesHttp {
  static async uploadFile(files) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/files/upload-files`,
      files
    );
  }

  static async uploadFileOne(file) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/files/upload-file`,
      file
    );
  }

  static async deleteFiles(files) {
    return await axios.post(
      `${process.env.REACT_APP_HOST}/files/delete-files`,
      files
    );
  }

  static async deleteFile(file) {
    return await axios.post(`${process.env.REACT_APP_HOST}/files/delete-file`, {
      fileName: file,
    });
  }
}
