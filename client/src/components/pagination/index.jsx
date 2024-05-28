import { useMemo } from "react";
import styles from "./pagination.module.css";

export default function Pagination({ totalPage, currPage, onChangePage }) {
  const getPages = useMemo(() => {
    let pages = [];
    let totalNumbers = 4;
    let totalBlocks = totalNumbers + 2;

    if (totalPage > totalBlocks) {
      let startPage = Math.max(2, currPage - 2);
      let endPage = Math.min(totalPage - 1, currPage + 2);
      let hasLeftSpill = startPage > 2;
      let hasRightSpill = totalPage - endPage > 1;
      let spillOffset = totalNumbers - (endPage - startPage + 1);

      if (hasLeftSpill && !hasRightSpill) {
        startPage -= spillOffset;
      } else if (!hasLeftSpill && hasRightSpill) {
        endPage += spillOffset;
      }

      if (currPage <= 4) {
        for (let i = 1; i <= endPage; i++) {
          pages.push(i);
        }
      } else {
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }

      if (hasLeftSpill) {
        pages.unshift("...");
        pages.unshift(1);
      }

      if (currPage >= totalPage - 3) {
        if (totalPage - endPage >= 2) {
          pages.push("...");
        }
        pages.push(totalPage);
      } else {
        if (hasRightSpill) {
          pages.push("...");
          pages.push(totalPage);
        }
      }
    } else {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }, [totalPage, currPage]);

  return (
    <div className={styles.pagination}>
      {getPages.map((page, index) => (
        <div
          key={index}
          className={`${styles.page} ${page === currPage ? styles.active : ""}`}
          onClick={() => typeof page === "number" && onChangePage(page)}
        >
          {page}
        </div>
      ))}
    </div>
  );
}
