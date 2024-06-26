export const AUTH_USER_ACTION = "AUTH_USER_ACTION";

const initialState = {
  isAuth: (localStorage.getItem("token") ? true : false) || false,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_USER_ACTION:
      return {
        isAuth: action?.payload.isAuth,
      };
    default:
      return state;
  }
};

export default AuthReducer;
