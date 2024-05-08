export const AUTH_USER_ACTION = "AUTH_USER_ACTION";

const initialState = {
  isAuth: false,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_USER_ACTION:
      return {
        ...state,
        isAuth: action?.payload.isAuth,
      };
    default:
      return state;
  }
};

export default AuthReducer;
