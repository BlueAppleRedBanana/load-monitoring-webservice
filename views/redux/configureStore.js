"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureStore;

var _redux = require("redux");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _apps = _interopRequireDefault(require("./apps"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const rootReducer = combineReducers({
//     'root': appReducer,
// });
function configureStore(preloadedState) {
  return (0, _redux.createStore)(_apps.default, preloadedState, (0, _redux.applyMiddleware)(_reduxThunk.default));
}