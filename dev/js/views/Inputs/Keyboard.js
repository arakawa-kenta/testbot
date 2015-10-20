/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./UserInputs.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vehicle;
(function (Vehicle) {
    var Keyboard = (function (_super) {
        __extends(Keyboard, _super);
        function Keyboard() {
            var _this = this;
            _super.call(this);
            this._keyState = {};
            this._keyDown = function (event) {
                var input = _this._createUserInputs(event.keyCode, true);
                if (!_this._keyState.hasOwnProperty(event.keyCode.toString()))
                    _this._keyState[event.keyCode] = false;
                if (!_this._keyState[event.keyCode.toString()]) {
                    _this.emit("inputs", input);
                }
                _this._keyState[event.keyCode.toString()] = true;
            };
            this._keyUp = function (event) {
                var input = _this._createUserInputs(event.keyCode, false);
                _this.emit("inputs", input);
                _this._keyState[event.keyCode.toString()] = false;
            };
            document.onkeydown = this._keyDown;
            document.onkeyup = this._keyUp;
        }
        Keyboard.prototype._createUserInputs = function (keyCode, flag, value) {
            var type;
            switch (keyCode) {
                case 38:
                    type = Vehicle.InputType.Front;
                    value = 1.0;
                    break;
                case 40:
                    type = Vehicle.InputType.Back;
                    value = 1.0;
                    break;
                case 37:
                    type = Vehicle.InputType.Left;
                    value = 0.5;
                    break;
                case 39:
                    type = Vehicle.InputType.Right;
                    value = 0.5;
                    break;
                case 81:
                    type = Vehicle.InputType.HeadUp;
                    break;
                case 65:
                    type = Vehicle.InputType.HeadDown;
                    break;
                case 85:
                    type = Vehicle.InputType.GearUp;
                    break;
                case 78:
                    type = Vehicle.InputType.GearDown;
                    break;
                case 80:
                    type = Vehicle.InputType.Button1;
                    break;
                case 32:
                    type = Vehicle.InputType.SwitchCamera;
                    break;
                case 87:
                    type = Vehicle.InputType.Wiper;
                    break;
                case 83:
                    type = Vehicle.InputType.Shot;
                    break;
                case 77:
                    type = Vehicle.InputType.Mic;
                    break;
                default:
                    type = Vehicle.InputType.Misc;
            }
            if (value === undefined)
                return { type: type, flag: flag };
            return { type: type, flag: flag, value: value };
        };
        return Keyboard;
    })(EventEmitter2);
    Vehicle.Keyboard = Keyboard;
})(Vehicle || (Vehicle = {}));
