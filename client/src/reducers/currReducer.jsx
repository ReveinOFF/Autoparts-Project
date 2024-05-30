export const DATA_CURR_ACTION = "DATA_CURR_ACTION";
export const DEFAULT_DATA_CURR_ACTION = "DATA_CURR_ACTION_DEF";

const initialState = {
  key: "usd",
  course: 1,
};

const CurrReducer = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case DATA_CURR_ACTION:
      return {
        ...payload,
      };
    case DEFAULT_DATA_CURR_ACTION:
      return initialState;
    default:
      return state;
  }
};

export default CurrReducer;
