import styles from "./ms.module.css";
import close from "../../../assets/images/admin/ha_exit.svg";
import { useState } from "react";

export default function MultiSelect({
  data,
  changeSelected,
  onClose,
  selected,
}) {
  const [selectedCategories, setSelectedCategories] = useState(selected || []);

  const confirmSelection = () => {
    changeSelected(selectedCategories);
  };

  return (
    <div className={styles.modal}>
      <div>
        <img src={close} alt="close" width={15} onClick={onClose} />
        <div className={styles.select_block}>
          {data?.map((item) => (
            <fieldset key={item._id}>
              <input
                type="checkbox"
                name={item.title}
                checked={selectedCategories.includes(item._id)}
                onClick={() => {
                  if (selectedCategories.includes(item._id))
                    setSelectedCategories((prev) =>
                      prev.filter((val) => val !== item._id)
                    );
                  else setSelectedCategories((prev) => [...prev, item._id]);
                }}
              />
              <label htmlFor="check">{item.title}</label>
            </fieldset>
          ))}
        </div>
        <button onClick={confirmSelection}>Вибрати</button>
      </div>
    </div>
  );
}
