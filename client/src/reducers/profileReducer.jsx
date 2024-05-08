export const DATA_USER_ACTION = "DATA_USER_ACTION";
export const DEFAULT_DATA_USER_ACTION = "DATA_USER_ACTION";

const initialState = {
  name: "User",
  surname: "",
  role: "",
  _id: "",
  login: "",
};

const ProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case DATA_USER_ACTION:
      return Object.assign(state, action.payload);
    case DEFAULT_DATA_USER_ACTION:
      return initialState;
    default:
      return state;
  }
};

export default ProfileReducer;
