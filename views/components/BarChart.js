"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _victory = require("victory");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var sampleData = [{
  x: 1,
  y: 10
}, {
  x: 2,
  y: 20
}];

var BarChart =
/*#__PURE__*/
function (_React$Component) {
  _inherits(BarChart, _React$Component);

  function BarChart(props) {
    var _this;

    _classCallCheck(this, BarChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BarChart).call(this));
    _this.state = {
      data: props.data
    };
    return _this;
  } // shouldComponentUpdate(nextProps, nextState){
  //     const lastTick =  last(nextState.data);
  //     return get(lastTick, 'timestamp') !== get(last(this.state.data), 'timestamp');
  // }


  _createClass(BarChart, [{
    key: "render",
    value: function render() {
      return _react.default.createElement(_victory.VictoryChart, {
        theme: _victory.VictoryTheme.material,
        domainPadding: {
          x: 20,
          y: 0
        },
        padding: {
          top: 0,
          bottom: 32,
          right: 12,
          left: 40
        }
      }, _react.default.createElement(_victory.VictoryAxis, {
        style: {
          grid: {
            stroke: 'none'
          }
        },
        tickCount: 10,
        tickFormat: function tickFormat(x) {
          return (0, _moment.default)(x).format('H:mm:ss');
        }
      }), _react.default.createElement(_victory.VictoryAxis, {
        dependentAxis: true
      }), _react.default.createElement(_victory.VictoryBar, {
        data: this.state.data
      }));
    }
  }]);

  return BarChart;
}(_react.default.Component);

exports.default = BarChart;