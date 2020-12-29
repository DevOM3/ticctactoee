export const initialState = {
  nickname: "",
  userID: null,
};

export const actionTypes = {
  SET_NICKNAME: "SET_NICKNAME",
  SET_USER_ID: "SET_USER_ID",
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actionTypes.SET_NICKNAME:
      return {
        ...state,
        nickname: action.nickname,
      };
    case actionTypes.SET_USER_ID:
      return {
        ...state,
        userID: action.userID,
      };
    default:
      return state;
  }
};

export default reducer;
