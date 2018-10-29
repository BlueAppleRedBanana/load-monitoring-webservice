"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _victory = require("victory");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sampleData = [{
  x: 1,
  y: 10
}, {
  x: 2,
  y: 20
}];

var BarChart = function BarChart() {
  return _react.default.createElement(_victory.VictoryChart, null, _react.default.createElement(_victory.VictoryBar, {
    data: sampleData
  }));
};

var _default = BarChart;
exports.default = _default;