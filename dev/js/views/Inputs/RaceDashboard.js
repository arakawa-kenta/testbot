/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../views/Inputs/UserInputs.ts" />
/// <reference path="../../views/Inputs/VehicleMessage.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vehicle;
(function (Vehicle) {
    var RaceDashboard = (function (_super) {
        __extends(RaceDashboard, _super);
        function RaceDashboard(isDouble) {
            var _this = this;
            _super.call(this);
            this._DrivingState = "StopMoving";
            this._WiperState = false;
            this._isDouble = true;
            this._currentGear = 0;
            this._gear2value = [0.3, 0.4, 0.6];
            this._radius = 0;
            this.onData = function (data) {
                if (data.hasOwnProperty(Vehicle.MessageType.VehicleBattery) && data.hasOwnProperty(Vehicle.MessageType.IOSBattery)) {
                    _this._batteryChanged(data[Vehicle.MessageType.VehicleBattery], data[Vehicle.MessageType.IOSBattery]);
                }
                if (data.hasOwnProperty(Vehicle.MessageType.CameraPosition)) {
                    _this._cameraPositionChanged(data[Vehicle.MessageType.CameraPosition]);
                }
            };
            this.onInput = function (inputs) {
                if (inputs.flag === true && (inputs.type === Vehicle.InputType.GearUp || inputs.type === Vehicle.InputType.GearDown)) {
                    _this._gearChange(inputs);
                }
                if (inputs.type === Vehicle.InputType.Front || inputs.type === Vehicle.InputType.Back || inputs.type === Vehicle.InputType.Right || inputs.type === Vehicle.InputType.Left) {
                    _this._drivingStateChanged(inputs);
                }
                if (inputs.type === Vehicle.InputType.Wiper) {
                    _this._wiperStateChanged(inputs);
                }
            };
            this.getGearValue = function () {
                return _this._gear2value[_this._currentGear];
            };
            this._gearChange = function (inputs) {
                if (inputs.type === Vehicle.InputType.GearUp && _this._currentGear < _this._gear2value.length - 1) {
                    _this._currentGear++;
                }
                else if (inputs.type === Vehicle.InputType.GearDown && _this._currentGear > 0) {
                    _this._currentGear--;
                }
                $("#gear").attr("src", "./img/gear-" + _this._currentGear + ".png");
                _this._changeDrivingDisplay();
                _this._updateSpeed();
            };
            this._updateSpeed = function () {
                if (_this._DrivingState.indexOf("Forward") >= 0) {
                    _this.emit("message", { type: Vehicle.InputType.Front, flag: true, value: _this.getGearValue() });
                }
                else if (_this._DrivingState.indexOf("Backward") >= 0) {
                    _this.emit("message", { type: Vehicle.InputType.Back, flag: true, value: _this.getGearValue() });
                }
            };
            this._batteryChanged = function (v_battery, i_battery) {
                var vehicle_angle = 0;
                var ios_angle = 0;
                if (v_battery <= 1 && v_battery >= 0) {
                    vehicle_angle = 122 * v_battery;
                }
                if (i_battery <= 1 && i_battery >= 0) {
                    ios_angle = 122 * i_battery;
                }
                _this._updateTransform($("#vehicle-string"), vehicle_angle);
                _this._updateTransform($("#ios-string"), ios_angle);
            };
            this._cameraPositionChanged = function (pos) {
                if (_this._isDouble && pos == "back") {
                    $("#remote-video").css({
                        "-webkit-transform": 'rotateY(180deg)',
                        "-moz-transform": 'rotateY(180deg)',
                        "-o-transform": 'rotateY(180deg)',
                        "-ms-transform": 'rotateY(180deg)'
                    });
                }
                else {
                    $("#remote-video").css({
                        "-webkit-transform": 'rotateY(0deg)',
                        "-moz-transform": 'rotateY(0deg)',
                        "-o-transform": 'rotateY(0deg)',
                        "-ms-transform": 'rotateY(0deg)'
                    });
                }
            };
            this._wiperStateChanged = function (inputs) {
                if (!_this._WiperState && inputs.flag) {
                    _this._WiperState = true;
                    $(".wiper").addClass("wiper-rotate");
                    setTimeout(function () {
                        $(".wiper").removeClass("wiper-rotate");
                    }, 500);
                    _this._Timer = setInterval(function () {
                        $(".wiper").addClass("wiper-rotate");
                        setTimeout(function () {
                            $(".wiper").removeClass("wiper-rotate");
                        }, 500);
                    }, 1000);
                }
                else if (_this._WiperState && inputs.flag) {
                    _this._WiperState = false;
                    clearInterval(_this._Timer);
                }
            };
            this._drivingStateChanged = function (inputs) {
                if ((inputs.type === Vehicle.InputType.Right || inputs.type === Vehicle.InputType.Left) && inputs.flag) {
                    _this._radius = inputs.value;
                }
                switch (_this._DrivingState) {
                    case "StopMoving":
                        switch (inputs.type) {
                            case Vehicle.InputType.Front:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingForward";
                                break;
                            case Vehicle.InputType.Back:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingBackward";
                                break;
                            case Vehicle.InputType.Right:
                                if (inputs.flag)
                                    _this._DrivingState = "RotatingRight";
                                break;
                            case Vehicle.InputType.Left:
                                if (inputs.flag)
                                    _this._DrivingState = "RotatingLeft";
                                break;
                        }
                        break;
                    case "DrivingForward":
                        switch (inputs.type) {
                            case Vehicle.InputType.Front:
                                if (!inputs.flag)
                                    _this._DrivingState = "StopMoving";
                                break;
                            case Vehicle.InputType.Back:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingBackward";
                                break;
                            case Vehicle.InputType.Right:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyForwardRight";
                                break;
                            case Vehicle.InputType.Left:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyForwardLeft";
                                break;
                        }
                        break;
                    case "DrivingBackward":
                        switch (inputs.type) {
                            case Vehicle.InputType.Front:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingForward";
                                break;
                            case Vehicle.InputType.Back:
                                if (!inputs.flag)
                                    _this._DrivingState = "StopMoving";
                                break;
                            case Vehicle.InputType.Right:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyBackwardRight";
                                break;
                            case Vehicle.InputType.Left:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyBackwardLeft";
                                break;
                        }
                        break;
                    case "RotatingRight":
                        switch (inputs.type) {
                            case Vehicle.InputType.Front:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyForwardRight";
                                break;
                            case Vehicle.InputType.Back:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyBackwardRight";
                                break;
                            case Vehicle.InputType.Right:
                                if (!inputs.flag)
                                    _this._DrivingState = "StopMoving";
                                break;
                            case Vehicle.InputType.Left:
                                if (inputs.flag)
                                    _this._DrivingState = "RotatingLeft";
                                break;
                        }
                        break;
                    case "RotatingLeft":
                        switch (inputs.type) {
                            case Vehicle.InputType.Front:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyForwardLeft";
                                break;
                            case Vehicle.InputType.Back:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyBackwardLeft";
                                break;
                            case Vehicle.InputType.Right:
                                if (inputs.flag)
                                    _this._DrivingState = "RotatingRight";
                                break;
                            case Vehicle.InputType.Left:
                                if (!inputs.flag)
                                    _this._DrivingState = "StopMoving";
                                break;
                        }
                        break;
                    case "DrivingDiagonallyForwardRight":
                        switch (inputs.type) {
                            case Vehicle.InputType.Front:
                                if (!inputs.flag)
                                    _this._DrivingState = "RotatingRight";
                                break;
                            case Vehicle.InputType.Back:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyBackwardRight";
                                break;
                            case Vehicle.InputType.Right:
                                if (!inputs.flag)
                                    _this._DrivingState = "DrivingForward";
                                break;
                            case Vehicle.InputType.Left:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyForwardLeft";
                                break;
                        }
                        break;
                    case "DrivingDiagonallyForwardLeft":
                        switch (inputs.type) {
                            case Vehicle.InputType.Front:
                                if (!inputs.flag)
                                    _this._DrivingState = "RotatingLeft";
                                break;
                            case Vehicle.InputType.Back:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyBackwardLeft";
                                break;
                            case Vehicle.InputType.Right:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyForwardRight";
                                break;
                            case Vehicle.InputType.Left:
                                if (!inputs.flag)
                                    _this._DrivingState = "DrivingForward";
                                break;
                        }
                        break;
                    case "DrivingDiagonallyBackwardRight":
                        switch (inputs.type) {
                            case Vehicle.InputType.Front:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyForwardRight";
                                break;
                            case Vehicle.InputType.Back:
                                if (!inputs.flag)
                                    _this._DrivingState = "RotatingRight";
                                break;
                            case Vehicle.InputType.Right:
                                if (!inputs.flag)
                                    _this._DrivingState = "DrivingBackward";
                                break;
                            case Vehicle.InputType.Left:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyBackwardLeft";
                                break;
                        }
                        break;
                    case "DrivingDiagonallyBackwardLeft":
                        switch (inputs.type) {
                            case Vehicle.InputType.Front:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyForwardLeft";
                                break;
                            case Vehicle.InputType.Back:
                                if (!inputs.flag)
                                    _this._DrivingState = "RotatingLeft";
                                break;
                            case Vehicle.InputType.Right:
                                if (inputs.flag)
                                    _this._DrivingState = "DrivingDiagonallyBackwardRight";
                                break;
                            case Vehicle.InputType.Left:
                                if (!inputs.flag)
                                    _this._DrivingState = "DrivingBackward";
                                break;
                        }
                        break;
                }
                _this._changeDrivingDisplay();
            };
            this._changeDrivingDisplay = function () {
                if (_this._DrivingState.indexOf("Diagonally") >= 0) {
                    if (_this._DrivingState.indexOf("Left") >= 0) {
                        _this._updateTransform($("#handle"), _this._radius * -120);
                    }
                    else {
                        _this._updateTransform($("#handle"), _this._radius * 120);
                    }
                    _this._updateTransform($("#string"), _this._gear2value[_this._currentGear] * 140);
                }
                else if (_this._DrivingState.indexOf("Rotating") >= 0) {
                    if (_this._DrivingState.indexOf("Left") >= 0) {
                        _this._updateTransform($("#handle"), _this._radius * -120);
                    }
                    else {
                        _this._updateTransform($("#handle"), _this._radius * 120);
                    }
                    _this._updateTransform($("#string"), _this._radius * 50);
                }
                else if (_this._DrivingState.indexOf("Stop") >= 0) {
                    _this._updateTransform($("#handle"), 0);
                    _this._updateTransform($("#string"), 0);
                }
                else {
                    _this._updateTransform($("#handle"), 0);
                    _this._updateTransform($("#string"), _this._gear2value[_this._currentGear] * 180);
                }
            };
            this._updateTransform = function ($dom, value) {
                $dom.css({
                    "-webkit-transform": 'rotate(' + value + 'deg)',
                    "-moz-transform": 'rotate(' + value + 'deg)',
                    "-o-transform": 'rotate(' + value + 'deg)',
                    "-ms-transform": 'rotate(' + value + 'deg)'
                });
            };
            this._isDouble = isDouble;
        }
        return RaceDashboard;
    })(EventEmitter2);
    Vehicle.RaceDashboard = RaceDashboard;
})(Vehicle || (Vehicle = {}));
