export const DATA_USER_ACTION = "DATA_USER_ACTION";
export const DEFAULT_DATA_USER_ACTION = "DATA_USER_ACTION";

const initialState = {
  name: "User",
};

const ProfileReducer = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case DATA_USER_ACTION:
      return {
        ...state,
        ...payload,
      };
    case DEFAULT_DATA_USER_ACTION:
      return initialState;
    default:
      return state;
  }
};

export default ProfileReducer;
