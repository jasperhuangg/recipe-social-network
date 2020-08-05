import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";

const initialState = {
  userID: "",
  viewingRecipe: "",
  viewingRecipeStep: 1,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "setUserID":
      return { ...state, userID: action.value };
    case "setViewingRecipe":
      return { ...state, viewingRecipe: action.value };
    case "setViewingRecipeStep":
      return { ...state, viewingRecipeStep: action.value };
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

export { store };

const setUserID = (userID) => {
  return {
    type: "setUserID",
    value: userID,
  };
};

export { setUserID };

const setViewingRecipe = (viewingRecipe) => {
  return {
    type: "setViewingRecipe",
    value: viewingRecipe,
  };
};

export { setViewingRecipe };

const setViewingRecipeStep = (stepNum) => {
  return {
    type: "setViewingRecipe",
    value: stepNum,
  };
};

export { setViewingRecipeStep };
