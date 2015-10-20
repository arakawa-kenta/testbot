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
    var Gamepad = (function (_super) {
        __extends(Gamepad, _super);
        function Gamepad() {
            var _this = this;
            _super.call(this);
            this._onGamepadConnect = function () {
                _this._startPolling();
            };
            this._onGamepadDisconnect = function () {
            };
            this._tick = function () {
                _this._pollGamepads();
                _this._pollStatus();
                _this._scheduleNextTick();
            };
            this._ticking = false;
            this._gamepads = [];
            this._prevRawGamepadTypes = [];
            this._TYPICAL_BUTTON_COUNT = 16;
            this._TYPICAL_AXIS_COUNT = 4;
            this._lastButtons = [];
            this._lastAxes = [];
            var gamepadSupportAvailable = navigator.getGamepads || !!navigator.webkitGetGamepads;
            if (!gamepadSupportAvailable) {
            }
            else {
                if ('ongamepadconnected' in window) {
                    window.addEventListener('gamepadconnected', this._onGamepadConnect, false);
                    window.addEventListener('gamepaddisconnected', this._onGamepadDisconnect, false);
                }
                else {
                    this._startPolling();
                }
            }
        }
        Gamepad.prototype._startPolling = function () {
            if (!this._ticking) {
                this._ticking = true;
                this._tick();
            }
        };
        Gamepad.prototype._pollStatus = function () {
            if (this._gamepads.length > 0) {
                for (var i = 0; i < this._gamepads[0].buttons.length; i++) {
                    var button = this._gamepads[0].buttons[i];
                    //PS4controller's bug (when GamePad is connected, shoulder button's value is 0.5)
                    var pressed = (button.value > 0.6);
                    if (i >= this._lastButtons.length) {
                        this._lastButtons[i] = false;
                    }
                    if (this._lastButtons[i] != pressed) {
                        this.emit("inputs", this._createUserInputs(i, pressed, button.value));
                    }
                    this._lastButtons[i] = pressed;
                }
                for (var i = 0; i < this._gamepads[0].axes.length; i++) {
                    var axe = this._judgeAxe(this._gamepads[0].axes[i]);
                    if (i >= this._lastAxes.length) {
                        this._lastAxes[i] = 0;
                    }
                    if (this._lastAxes[i] != axe) {
                        this.emit("inputs", this._createUserInputsAxe(i, axe, this._lastAxes[i]));
                    }
                    this._lastAxes[i] = axe;
                }
            }
        };
        Gamepad.prototype._pollGamepads = function () {
            var rawGamepads = (navigator.getGamepads && navigator.getGamepads()) || (navigator.webkitGetGamepads && navigator.webkitGetGamepads());
            if (rawGamepads) {
                this._gamepads = [];
                var gamepadsChanged = false;
                for (var i = 0; i < rawGamepads.length; i++) {
                    if (typeof rawGamepads[i] != this._prevRawGamepadTypes[i]) {
                        gamepadsChanged = true;
                        this._prevRawGamepadTypes[i] = typeof rawGamepads[i];
                    }
                    if (rawGamepads[i]) {
                        this._gamepads.push(rawGamepads[i]);
                    }
                }
            }
            else {
                this._gamepads = [];
                this._prevRawGamepadTypes = [];
                this._lastButtons = [];
            }
        };
        Gamepad.prototype._scheduleNextTick = function () {
            if (this._ticking) {
                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(this._tick);
                }
            }
        };
        Gamepad.prototype._createUserInputs = function (buttonId, flag, value) {
            var type;
            switch (buttonId) {
                case 12:
                    type = Vehicle.InputType.Front;
                    value = 1.0;
                    break;
                case 13:
                    type = Vehicle.InputType.Back;
                    value = 1.0;
                    break;
                case 14:
                    type = Vehicle.InputType.Left;
                    value = 0.5;
                    break;
                case 15:
                    type = Vehicle.InputType.Right;
                    value = 0.5;
                    break;
                case 0:
                    type = Vehicle.InputType.HeadDown;
                    break;
                case 1:
                    type = Vehicle.InputType.Wiper;
                    break;
                case 2:
                    type = Vehicle.InputType.SwitchCamera;
                    break;
                case 3:
                    type = Vehicle.InputType.HeadUp;
                    break;
                case 4:
                    type = Vehicle.InputType.GearDown;
                    break;
                case 5:
                    type = Vehicle.InputType.GearUp;
                    break;
                case 6:
                    type = Vehicle.InputType.Back;
                    value = 1.0;
                    break;
                case 7:
                    type = Vehicle.InputType.Front;
                    value = 1.0;
                    break;
                default:
                    type = Vehicle.InputType.Misc;
            }
            if (value === undefined)
                return { type: type, flag: flag };
            return { type: type, flag: flag, value: value };
        };
        Gamepad.prototype._judgeAxe = function (axe) {
            axe = parseInt((axe * 5).toString()) / 5;
            return axe;
        };
        Gamepad.prototype._createUserInputsAxe = function (axeId, current, previous) {
            var type;
            var flag = false;
            var value = 0;
            switch (axeId) {
                case 0:
                    if (current < 0) {
                        flag = true;
                        type = Vehicle.InputType.Left;
                        value = -1 * current;
                    }
                    else if (current > 0) {
                        flag = true;
                        type = Vehicle.InputType.Right;
                        value = current;
                    }
                    else {
                        if (previous < 0) {
                            flag = false;
                            type = Vehicle.InputType.Left;
                        }
                        else if (previous > 0) {
                            flag = false;
                            type = Vehicle.InputType.Right;
                        }
                    }
                    break;
                case 1:
                    if (current > 0) {
                        flag = true;
                        type = Vehicle.InputType.Back;
                        value = current;
                    }
                    else if (current < 0) {
                        flag = true;
                        type = Vehicle.InputType.Front;
                        value = -1 * current;
                    }
                    else {
                        if (previous > 0) {
                            flag = false;
                            type = Vehicle.InputType.Back;
                        }
                        else if (previous < 0) {
                            flag = false;
                            type = Vehicle.InputType.Front;
                        }
                    }
                    break;
                default:
                    type = Vehicle.InputType.Misc;
            }
            return { type: type, flag: flag, value: value };
        };
        return Gamepad;
    })(EventEmitter2);
    Vehicle.Gamepad = Gamepad;
})(Vehicle || (Vehicle = {}));
