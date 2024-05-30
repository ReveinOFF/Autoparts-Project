import profileImg from "../../../assets/images/profile/profile.svg";
import arrowImg from "../../../assets/images/profile/arrow.svg";
import contactImg from "../../../assets/images/profile/contact.svg";
import deliveryImg from "../../../assets/images/profile/delivery.svg";
import logImg from "../../../assets/images/profile/login.svg";
import delImg from "../../../assets/images/profile/del.svg";
import vinImg from "../../../assets/images/profile/vin.svg";
import addImg from "../../../assets/images/profile/add.svg";
import styles from "./main.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  DATA_USER_ACTION,
  DEFAULT_DATA_USER_ACTION,
} from "../../../reducers/profileReducer";
import { AUTH_USER_ACTION } from "../../../reducers/authReducer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const state = useSelector((s) => s.profile);
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [tempData, setTempData] = useState({});
  const [sex, setSex] = useState("Male");
  const { t } = useTranslation();

  const [showB1, setShowB1] = useState(false);
  const [showB2, setShowB2] = useState(false);
  const [showB3, setShowB3] = useState(false);
  const [showB4, setShowB4] = useState(false);
  const [showB5, setShowB5] = useState(false);

  const [editB1, setEditB1] = useState(false);
  const [editB2, setEditB2] = useState(false);
  const [editB3, setEditB3] = useState(false);
  const [editB4, setEditB4] = useState(false);
  const [editB5, setEditB5] = useState(false);

  useEffect(() => {
    setTempData(state);
  }, [editB1, editB2, editB3, editB4, editB5]);

  const handleClick = async () => {
    const sendData = { userId: state._id, ...data };
    await axios.put(
      `${process.env.REACT_APP_HOST}/authentication/user/edit`,
      sendData
    );
    window.location.reload();
  };

  const removeLogin = () => {
    dispatch({ type: AUTH_USER_ACTION, payload: { isAuth: false } });
    dispatch({ type: DEFAULT_DATA_USER_ACTION });
    localStorage.removeItem("token");
    window.location.reload();
  };

  const logout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_HOST}/authentication/logout`);
      removeLogin();
    } catch (error) {}
  };

  const remAcc = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_HOST}/authentication/remove/${state._id}`
      );
      removeLogin();
    } catch (error) {}
  };

  const addAddress = () => {
    const newAddressItem = {
      city: "",
      street: "",
      house: "",
      apartment: "",
    };

    const updatedAddress = [...state.address, newAddressItem];
    dispatch({
      type: DATA_USER_ACTION,
      payload: { address: updatedAddress },
    });
    setData((prev) => ({ ...prev, address: updatedAddress }));
  };

  const deleteAddress = async (index) => {
    const updatedAddress = state.address.filter((_, i) => i !== index);
    dispatch({
      type: DATA_USER_ACTION,
      payload: { address: updatedAddress },
    });
    setData((prev) => ({ ...prev, address: updatedAddress }));

    const sendData = { userId: state._id, address: updatedAddress };
    await axios.put(
      `${process.env.REACT_APP_HOST}/authentication/user/edit`,
      sendData
    );
  };

  return (
    <>
      <h1>{t("profile.main.h1")}</h1>
      <div className="pf-b">
        <div className={`profile-block ${showB1 ? "active" : ""}`}>
          <div className="profile-block-btn" onClick={() => setShowB1(!showB1)}>
            <div>
              <img src={profileImg} alt="profile" width={18} />
              <h2>{t("profile.main.h2")}</h2>
            </div>
            <img src={arrowImg} alt="arrow" width={17} />
          </div>
          <div>
            <div
              className={`profile-ins ${styles.p1}`}
              style={{ columnGap: editB1 ? "10%" : "20%" }}
            >
              <div className="profile-info">
                <div>{t("profile.main.surname")}</div>
                {!editB1 ? (
                  <div>{state?.surname || t("profile.main.not-data")}</div>
                ) : (
                  <input
                    type="text"
                    name="surname"
                    className="profile-inp1"
                    defaultValue={state?.surname}
                    value={data?.surname}
                    style={{ width: 150 }}
                    onChange={(e) => {
                      setData((prev) => ({ ...prev, surname: e.target.value }));
                    }}
                  />
                )}
              </div>
              <div className="profile-info">
                <div>{t("profile.main.name")}</div>
                {!editB1 ? (
                  <div>{state?.name || t("profile.main.not-data")}</div>
                ) : (
                  <input
                    type="text"
                    name="name"
                    defaultValue={state?.name}
                    value={data?.name}
                    className="profile-inp1"
                    style={{ width: 130 }}
                    onChange={(e) => {
                      setData((prev) => ({ ...prev, name: e.target.value }));
                    }}
                  />
                )}
              </div>
              <div className="profile-info">
                <div>{t("profile.main.patr")}</div>
                {!editB1 ? (
                  <div>{state?.patronymic || t("profile.main.not-data")}</div>
                ) : (
                  <input
                    type="text"
                    name="name"
                    style={{ width: 150 }}
                    defaultValue={state?.patronymic}
                    value={data?.patronymic}
                    className="profile-inp1"
                    onChange={(e) => {
                      setData((prev) => ({
                        ...prev,
                        patronymic: e.target.value,
                      }));
                    }}
                  />
                )}
              </div>
              <div className="profile-info">
                <div>{t("profile.main.date")}</div>
                {!editB1 ? (
                  <div>
                    {new Date(state?.birthDay).toLocaleDateString("ru-RU") ||
                      t("profile.main.not-data")}
                  </div>
                ) : (
                  <input
                    type="date"
                    name="birthDay"
                    className="profile-inp1"
                    defaultValue={
                      state?.birthDay
                        ? new Date(state.birthDay).toISOString().split("T")[0]
                        : ""
                    }
                    value={data?.birthDay}
                    style={{ width: 150 }}
                    onChange={(e) => {
                      setData((prev) => ({
                        ...prev,
                        birthDay: e.target.value,
                      }));
                    }}
                  />
                )}
              </div>
              <div className="profile-info">
                <div>{t("profile.main.sex")}</div>
                {!editB1 ? (
                  <div>{state?.sex || t("profile.main.not-data")}</div>
                ) : (
                  <div
                    className={styles.select_sex}
                    onClick={() => {
                      if (sex === "Male") {
                        setSex("Female");
                        setData((prev) => ({ ...prev, sex: "female" }));
                        dispatch({
                          type: DATA_USER_ACTION,
                          payload: { sex: "female" },
                        });
                      } else {
                        setSex("Male");
                        setData((prev) => ({ ...prev, sex: "male" }));
                        dispatch({
                          type: DATA_USER_ACTION,
                          payload: { sex: "Female" },
                        });
                      }
                    }}
                  >
                    {sex}
                  </div>
                )}
              </div>
            </div>
            {!editB1 ? (
              <button
                className="profile-btn"
                onClick={() => {
                  if (state.sex !== "male" || state.sex !== "female") {
                    dispatch({
                      type: DATA_USER_ACTION,
                      payload: { sex: "male" },
                    });
                    setData({ sex: "male" });
                  }
                  setEditB1(true);
                  setSex("Male");
                }}
              >
                {t("profile.main.edit")}
              </button>
            ) : (
              <>
                <button className="profile-btn" onClick={handleClick}>
                  {t("profile.main.save")}
                </button>
                <button
                  className="profile-btn"
                  onClick={() => {
                    setData({});
                    setEditB1(false);
                    dispatch({
                      type: DATA_USER_ACTION,
                      payload: {
                        surname: tempData?.surname || "",
                        name: tempData?.name || "",
                        patronymic: tempData?.patronymic || "",
                        birthDay: tempData?.birthDay,
                        sex: tempData?.sex || "",
                      },
                    });
                  }}
                >
                  {t("profile.main.cancel")}
                </button>
              </>
            )}
          </div>
        </div>
        <div className={`profile-block ${showB2 ? "active" : ""}`}>
          <div className="profile-block-btn" onClick={() => setShowB2(!showB2)}>
            <div>
              <img src={contactImg} alt="profile" width={18} />
              <h2>{t("profile.main.contact")}</h2>
            </div>
            <img src={arrowImg} alt="arrow" width={17} />
          </div>
          <div>
            <div className={`profile-ins ${styles.p1}`}>
              <div className="profile-info">
                <div>{t("profile.main.email")}</div>
                {!editB2 ? (
                  <div>{state?.email || t("profile.main.not-data")}</div>
                ) : (
                  <input
                    type="email"
                    name="email"
                    className="profile-inp1"
                    style={{ width: "calc(100% + 50px)" }}
                    onChange={(e) => {
                      setData(() => ({ email: e.target.value }));
                      dispatch({
                        type: DATA_USER_ACTION,
                        payload: { email: e.target.value },
                      });
                    }}
                  />
                )}
              </div>
            </div>
            {!editB2 ? (
              <button
                className="profile-btn"
                onClick={() => {
                  setData({});
                  setEditB2(true);
                }}
              >
                {t("profile.main.edit")}
              </button>
            ) : (
              <>
                <button className="profile-btn" onClick={handleClick}>
                  {t("profile.main.save")}
                </button>
                <button
                  className="profile-btn"
                  onClick={() => {
                    setData({});
                    setEditB2(false);
                    dispatch({
                      type: DATA_USER_ACTION,
                      payload: { email: tempData?.email || "" },
                    });
                  }}
                >
                  {t("profile.main.cancel")}
                </button>
              </>
            )}
          </div>
        </div>
        <div className={`profile-block ${showB3 ? "active" : ""}`}>
          <div className="profile-block-btn" onClick={() => setShowB3(!showB3)}>
            <div>
              <img src={deliveryImg} alt="profile" width={18} />
              <h2>{t("profile.main.addr")}</h2>
            </div>
            <img src={arrowImg} alt="arrow" width={17} />
          </div>
          <div>
            {state.address?.map((item, index) => (
              <div className={`profile-ins ${styles.p2}`}>
                <div className="profile-info">
                  <div>{t("profile.main.city")}</div>
                  <div>
                    <input
                      type="text"
                      className="profile-inp1"
                      value={item.city}
                      onChange={(e) => {
                        const newAddress = state.address.map((addr, i) =>
                          i === index ? { ...addr, city: e.target.value } : addr
                        );
                        dispatch({
                          type: DATA_USER_ACTION,
                          payload: {
                            address: newAddress,
                          },
                        });
                        setData((prev) => ({ ...prev, address: newAddress }));
                      }}
                      disabled={!editB3}
                    />
                  </div>
                </div>
                <div className="profile-info">
                  <div>{t("profile.main.street")}</div>
                  <div>
                    <input
                      type="text"
                      className="profile-inp2"
                      value={item.street}
                      onChange={(e) => {
                        const newAddress = state.address.map((addr, i) =>
                          i === index
                            ? { ...addr, street: e.target.value }
                            : addr
                        );
                        dispatch({
                          type: DATA_USER_ACTION,
                          payload: {
                            address: newAddress,
                          },
                        });
                        setData((prev) => ({ ...prev, address: newAddress }));
                      }}
                      disabled={!editB3}
                    />
                  </div>
                </div>
                <div className="profile-info">
                  <div>{t("profile.main.house")}</div>
                  <div>
                    <input
                      type="text"
                      className="profile-inp2"
                      value={item.house}
                      onChange={(e) => {
                        const newAddress = state.address.map((addr, i) =>
                          i === index
                            ? { ...addr, house: e.target.value }
                            : addr
                        );
                        dispatch({
                          type: DATA_USER_ACTION,
                          payload: {
                            address: newAddress,
                          },
                        });
                        setData((prev) => ({ ...prev, address: newAddress }));
                      }}
                      disabled={!editB3}
                    />
                  </div>
                </div>
                <div className="profile-info">
                  <div>{t("profile.main.apart")}</div>
                  <div>
                    <input
                      type="text"
                      className="profile-inp2"
                      value={item.apartment}
                      onChange={(e) => {
                        const newAddress = state.address.map((addr, i) =>
                          i === index
                            ? { ...addr, apartment: e.target.value }
                            : addr
                        );
                        dispatch({
                          type: DATA_USER_ACTION,
                          payload: {
                            address: newAddress,
                          },
                        });
                        setData((prev) => ({ ...prev, address: newAddress }));
                      }}
                      disabled={!editB3}
                    />
                  </div>
                </div>
                <img
                  src={delImg}
                  alt="delete"
                  width={25}
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteAddress(index)}
                />
              </div>
            ))}
            <div className={styles.add} onClick={addAddress}>
              <img src={addImg} alt="add" width={20} />
              <span>{t("profile.main.addr2")}</span>
            </div>
            {!editB3 ? (
              <button
                className="profile-btn"
                onClick={() => {
                  setData({});
                  setEditB3(true);
                }}
              >
                {t("profile.main.edit")}
              </button>
            ) : (
              <>
                <button className="profile-btn" onClick={handleClick}>
                  {t("profile.main.save")}
                </button>
                <button
                  className="profile-btn"
                  onClick={() => {
                    setData({});
                    setEditB3(false);
                    dispatch({
                      type: DATA_USER_ACTION,
                      payload: { address: tempData?.address || "" },
                    });
                  }}
                >
                  {t("profile.main.cancel")}
                </button>
              </>
            )}
          </div>
        </div>
        <div className={`profile-block ${showB4 ? "active" : ""}`}>
          <div className="profile-block-btn" onClick={() => setShowB4(!showB4)}>
            <div>
              <img src={logImg} alt="profile" width={18} />
              <h2>{t("profile.main.login")}</h2>
            </div>
            <img src={arrowImg} alt="arrow" width={17} />
          </div>
          <div>
            <div className={`profile-ins ${styles.p1}`}>
              <div className="profile-info">
                <div>{t("profile.main.log-em")}</div>
                {!editB4 ? (
                  <div>{state?.login || t("profile.main.not-data")}</div>
                ) : (
                  <input
                    type="email"
                    name="login"
                    className="profile-inp1"
                    style={{ width: "calc(100% + 50px)" }}
                    onChange={(e) => {
                      setData(() => ({ login: e.target.value }));
                      dispatch({
                        type: DATA_USER_ACTION,
                        payload: { login: e.target.value },
                      });
                    }}
                  />
                )}
              </div>
            </div>
            {!editB4 ? (
              <button
                className="profile-btn"
                onClick={() => {
                  setData({});
                  setEditB4(true);
                }}
              >
                {t("profile.main.edit")}
              </button>
            ) : (
              <>
                <button className="profile-btn" onClick={handleClick}>
                  {t("profile.main.save")}
                </button>
                <button
                  className="profile-btn"
                  onClick={() => {
                    setData({});
                    setEditB4(false);
                    dispatch({
                      type: DATA_USER_ACTION,
                      payload: { login: tempData?.login || "" },
                    });
                  }}
                >
                  {t("profile.main.cancel")}
                </button>
              </>
            )}
          </div>
        </div>
        <div className={`profile-block ${showB5 ? "active" : ""}`}>
          <div className="profile-block-btn" onClick={() => setShowB5(!showB5)}>
            <div>
              <img src={vinImg} alt="profile" width={18} />
              <h2>{t("profile.main.info")}</h2>
            </div>
            <img src={arrowImg} alt="arrow" width={17} />
          </div>
          <div>
            <div className={`profile-ins ${styles.p2}`}>
              <div className="profile-info">
                <div>{t("profile.main.vin")}</div>
                <div>
                  <input
                    type="text"
                    className="profile-inp1"
                    style={{ width: "calc(100% + 50px)" }}
                    value={state.vin}
                    disabled={!editB5}
                    onChange={(e) => {
                      setData(() => ({ vin: e.target.value }));
                      dispatch({
                        type: DATA_USER_ACTION,
                        payload: { vin: e.target.value },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            {!editB5 ? (
              <button
                className="profile-btn"
                onClick={() => {
                  setData({});
                  setEditB5(true);
                }}
              >
                {t("profile.main.edit")}
              </button>
            ) : (
              <>
                <button className="profile-btn" onClick={handleClick}>
                  {t("profile.main.save")}
                </button>
                <button
                  className="profile-btn"
                  onClick={() => {
                    setData({});
                    setEditB5(false);
                    dispatch({
                      type: DATA_USER_ACTION,
                      payload: { vin: tempData?.vin || "" },
                    });
                  }}
                >
                  {t("profile.main.cancel")}
                </button>
              </>
            )}
          </div>
        </div>
        <div className={styles.pe}>
          <Link to="password">{t("profile.main.change")}</Link>
          <div onClick={remAcc}>{t("profile.main.del")}</div>
        </div>
        <div className={styles.pl} onClick={logout}>
          {t("profile.main.exit")}
        </div>
      </div>
    </>
  );
}
