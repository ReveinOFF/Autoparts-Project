import { useRef } from "react";
import styles from "./export.module.css";
import axios from "axios";
import * as XLSX from "xlsx";

export default function ExportImport() {
  const refFile = useRef();

  const convertArrayBufferToXLSX = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    const fileURL = window.URL.createObjectURL(blob);
    return fileURL;
  };

  const convertArrayBufferToCSV = (data) => {
    const fileURL = window.URL.createObjectURL(new Blob([data]));
    return fileURL;
  };

  const createURL = (fileURL, type) => {
    if (fileURL) {
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `products.${type}`);
      document.body.appendChild(link);
      link.click();
    }
  };

  const exportFile = async (type) => {
    const res = await axios.get(
      `${process.env.REACT_APP_HOST}/product/export?format=${type}`
    );

    if (type === "csv") {
      const fileURL = convertArrayBufferToCSV(res.data);
      createURL(fileURL, type);
    } else if (type === "xlsx") {
      const fileURL = convertArrayBufferToXLSX(res.data);
      createURL(fileURL, type);
    }
  };

  const changeInp = async (e) => {
    if (e.target.files.length === 0) return;

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    await axios.post(`${process.env.REACT_APP_HOST}/product/import`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <div className={styles.block}>
      <button className={styles.import} onClick={() => refFile.current.click()}>
        Import CSV/XLSX file{" "}
        <input
          ref={refFile}
          type="file"
          name="file"
          accept=".csv,.xlsx"
          onChange={changeInp}
        />
      </button>
      <button className={styles.export1} onClick={() => exportFile("xlsx")}>
        Export to XLSX file
      </button>
      <button className={styles.export2} onClick={() => exportFile("csv")}>
        Export to CSV file
      </button>
    </div>
  );
}
