/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./UserInputs.ts" />
/// <reference path="../../views/Inputs/VehicleMessage.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vehicle;
(function (Vehicle) {
    var Msg;
    (function (Msg) {
        Msg[Msg["Romo"] = 0] = "Romo";
        Msg[Msg["SwitchCamera"] = 1] = "SwitchCamera";
        Msg[Msg["Mic"] = 2] = "Mic";
        Msg[Msg["Shot"] = 3] = "Shot";
        Msg[Msg["Button1"] = 4] = "Button1";
    })(Msg || (Msg = {}));
    var AndroidUserView = (function (_super) {
        __extends(AndroidUserView, _super);
        function AndroidUserView(isDouble) {
            var _this = this;
            _super.call(this);
            this._imgArray = [];
            this._pageX = null;
            this._pageY = null;
            this._evtFlag = {};
            this._isDouble = true;
            this.onData = function (data) {
                if (data.hasOwnProperty(Vehicle.MessageType.CameraPosition)) {
                    _this._cameraPositionChanged(data[Vehicle.MessageType.CameraPosition]);
                }
                if (data.hasOwnProperty(Vehicle.MessageType.ParkingState)) {
                    _this._parkingStateChanged(data[Vehicle.MessageType.ParkingState]);
                }
            };
            this.getMsgList = function () {
                var list = [];
                for (var n in Msg) {
                    if (typeof Msg[n] === 'number')
                        list.push(n);
                }
                return list;
            };
            this.onInput = function (inputs) {
                if (inputs.flag) {
                    $("#" + String(inputs.type)).trigger("click");
                }
            };
            this._cameraPositionChanged = function (pos) {
                if (pos == "back") {
                    $("#SwitchCamera").attr("name", "Back").attr("src", "./img/back-camera-android.png");
                }
                else {
                    $("#SwitchCamera").attr("name", "Front").attr("src", "./img/front-camera-android.png");
                }
            };
            this._loadParking = function () {
                $("#Button1").attr("src", "./img/park-loading.gif");
            };
            this._parkingStateChanged = function (pos) {
                if (pos == "driving") {
                    $("#Button1").attr("name", "Driving").attr("src", "./img/driving.png");
                }
                else if (pos == "parking") {
                    $("#Button1").attr("name", "Parking").attr("src", "./img/parking.png");
                }
            };
            this._createInput = function (arrow_name, flag) {
                var type = _this._judgeType(arrow_name);
                var value = 0;
                _this._evtFlag[type] = flag;
                if (type === Vehicle.InputType.Front || type === Vehicle.InputType.Back) {
                    value = 0.4;
                }
                else {
                    value = 0.5;
                }
                return { type: type, flag: flag, value: value };
            };
            this._judgeType = function (arrow_name) {
                var type;
                switch (arrow_name) {
                    case "front":
                        type = Vehicle.InputType.Front;
                        break;
                    case "back":
                        type = Vehicle.InputType.Back;
                        break;
                    case "left":
                        type = Vehicle.InputType.Left;
                        break;
                    case "right":
                        type = Vehicle.InputType.Right;
                        break;
                }
                return type;
            };
            this._takePhoto = function () {
                var $img = _this._copyFrame();
                _this._imgArray.push($img);
                _this._render();
            };
            this._render = function () {
                $("#photo-lib").html("");
                for (var i in _this._imgArray) {
                    $("#photo-lib").append(_this._imgArray[i]);
                }
            };
            //copy video tag to canvas and translate DataURL for img tag
            this._copyFrame = function () {
                var cEle = $("#tmp-canvas")[0];
                var cCtx = cEle.getContext('2d');
                var $vEle = $('#remote-video');
                cEle.width = $vEle.width();
                cEle.height = $vEle.height();
                var vEle = document.getElementById('remote-video');
                var exp = $vEle.width() / vEle.videoWidth;
                if (_this._isDouble && $("#SwitchCamera").attr("name") === "Back") {
                    cCtx.scale(-exp, exp);
                    cCtx.drawImage($vEle[0], -vEle.videoWidth, 0);
                }
                else {
                    cCtx.scale(exp, exp);
                    cCtx.drawImage($vEle[0], 0, 0);
                }
                var img = new Image(cEle.width, cEle.height);
                img.src = cEle.toDataURL('image/png');
                var $tmp = $("<a/>").attr("href", img.src).attr("download", "");
                $tmp.append(img);
                return $tmp;
            };
            this._isDouble = isDouble;
            //If the Robot is Double, hide Romo's icon
            if (isDouble) {
                $("#Romo").hide();
                $("#Button1").show();
            }
            this._evtFlag[Vehicle.InputType.Front] = false;
            this._evtFlag[Vehicle.InputType.Back] = false;
            this._evtFlag[Vehicle.InputType.Left] = false;
            this._evtFlag[Vehicle.InputType.Right] = false;
            this._evtFlag[Vehicle.InputType.HeadDown] = false;
            this._evtFlag[Vehicle.InputType.HeadUp] = false;
            $("#Shot").click(function (evt) {
                $(evt.target).addClass('img-hover');
                $("#remote-video").addClass('img-hover');
                setTimeout(function () {
                    $(evt.target).removeClass('img-hover');
                    $("#remote-video").removeClass('img-hover');
                }, 100);
                _this._takePhoto();
            });
            $("#Gallery").click(function (evt) {
                $(evt.target).addClass('img-hover');
                //show library
                $("#photo-div").slideDown();
                setTimeout(function () {
                    $(evt.target).removeClass('img-hover');
                }, 100);
            });
            $("#photo-div").click(function (evt) {
                $("#photo-div").slideUp();
            });
            $("#remote-video").bind("touchstart", function (evt) {
                evt.preventDefault();
                var evt_touch = evt.originalEvent;
                _this._pageX = evt_touch.changedTouches[0].pageX;
                _this._pageY = evt_touch.changedTouches[0].pageY;
            });
            //When swiping up and down on the remote video view, the robot's head move up and down
            //When swiping left and right, the robot rotates left and right
            $("#remote-video").bind("touchmove", function (evt) {
                evt.preventDefault();
                var evt_touch = evt.originalEvent;
                //threshold of swipe event
                var targetWidth = evt_touch.changedTouches[0].target.clientWidth / 8;
                if (evt_touch.changedTouches[0].pageY - _this._pageY < -1 * targetWidth) {
                    if (!_this._evtFlag[Vehicle.InputType.HeadUp]) {
                        _this._evtFlag[Vehicle.InputType.HeadUp] = true;
                        _this.emit("message", { type: Vehicle.InputType.HeadUp, flag: true });
                    }
                }
                else if (evt_touch.changedTouches[0].pageY - _this._pageY > targetWidth) {
                    if (!_this._evtFlag[Vehicle.InputType.HeadDown]) {
                        _this._evtFlag[Vehicle.InputType.HeadDown] = true;
                        _this.emit("message", { type: Vehicle.InputType.HeadDown, flag: true });
                    }
                }
                else {
                    if (_this._evtFlag[Vehicle.InputType.HeadUp]) {
                        _this._evtFlag[Vehicle.InputType.HeadUp] = false;
                        _this.emit("message", { type: Vehicle.InputType.HeadUp, flag: false });
                    }
                    if (_this._evtFlag[Vehicle.InputType.HeadDown]) {
                        _this._evtFlag[Vehicle.InputType.HeadDown] = false;
                        _this.emit("message", { type: Vehicle.InputType.HeadUp, flag: false });
                    }
                }
                if (evt_touch.changedTouches[0].pageX - _this._pageX < -1 * targetWidth) {
                    if (!_this._evtFlag[Vehicle.InputType.Left]) {
                        _this._evtFlag[Vehicle.InputType.Left] = true;
                        _this.emit("message", { type: Vehicle.InputType.Left, flag: true, value: 0.5 });
                    }
                }
                else if (evt_touch.changedTouches[0].pageX - _this._pageX > targetWidth) {
                    if (!_this._evtFlag[Vehicle.InputType.Right]) {
                        _this._evtFlag[Vehicle.InputType.Right] = true;
                        _this.emit("message", { type: Vehicle.InputType.Right, flag: true, value: 0.5 });
                    }
                }
                else {
                    if (_this._evtFlag[Vehicle.InputType.Left]) {
                        _this._evtFlag[Vehicle.InputType.Left] = false;
                        _this.emit("message", { type: Vehicle.InputType.Left, flag: false, value: 0.0 });
                    }
                    if (_this._evtFlag[Vehicle.InputType.Right]) {
                        _this._evtFlag[Vehicle.InputType.Right] = false;
                        _this.emit("message", { type: Vehicle.InputType.Right, flag: false, value: 0.0 });
                    }
                }
            });
            $("#remote-video").bind("touchend", function (evt) {
                _this._evtFlag[Vehicle.InputType.HeadUp] = false;
                _this._evtFlag[Vehicle.InputType.HeadDown] = false;
                _this._evtFlag[Vehicle.InputType.Left] = false;
                _this._evtFlag[Vehicle.InputType.Right] = false;
                _this.emit("message", { type: Vehicle.InputType.HeadUp, flag: false });
                _this.emit("message", { type: Vehicle.InputType.HeadDown, flag: false });
                _this.emit("message", { type: Vehicle.InputType.Left, flag: false, value: 0 });
                _this.emit("message", { type: Vehicle.InputType.Right, flag: false, value: 0 });
            });
            $(".arrow > img").bind("touchstart", function (evt) {
                evt.preventDefault();
                $(evt.target).addClass("img-hover");
                var arrow_name = $(evt.target).parent().attr('id');
                var input = _this._createInput(arrow_name, true);
                _this.emit("message", input);
            });
            $(".arrow > img").bind("touchmove", function (evt) {
                evt.preventDefault();
                var arrow_name = $(evt.target).parent().attr('id');
                var type = _this._judgeType(arrow_name);
                if (_this._evtFlag[type]) {
                    var evt_touch = evt.originalEvent;
                    var targetLeft = evt_touch.changedTouches[0].target.x;
                    var targetTop = evt_touch.changedTouches[0].target.y;
                    var targetRight = targetLeft + evt_touch.changedTouches[0].target.width;
                    var targetBottom = targetTop + evt_touch.changedTouches[0].target.height;
                    //When the finger move out of the arrow image, the robot stops moving
                    if (evt_touch.changedTouches[0].pageX < targetLeft || evt_touch.changedTouches[0].pageX > targetRight || evt_touch.changedTouches[0].pageY < targetTop || evt_touch.changedTouches[0].pageY > targetBottom) {
                        $(evt.target).removeClass("img-hover");
                        var arrow_name = $(evt.target).parent().attr('id');
                        var input = _this._createInput(arrow_name, false);
                        _this.emit("message", input);
                    }
                }
            });
            $(".arrow > img").bind("touchend", function (evt) {
                $(evt.target).removeClass("img-hover");
                var arrow_name = $(evt.target).parent().attr('id');
                var input = _this._createInput(arrow_name, false);
                _this.emit("message", input);
            });
            $(".vehicle-control-btn").click(function (evt) {
                $(evt.target).blur();
                var msg = $(evt.target).attr('id');
                var name = $(evt.target).attr('name');
                switch (msg) {
                    case "Romo":
                        var type = Vehicle.InputType.Romo;
                        if (name === "Camera") {
                            $("#Romo").attr("name", "Romo").attr("src", "./img/romo-icon.png");
                            $("#romo-view").show();
                            $("#local-video").hide();
                            _this.emit("message", { type: type, flag: true });
                        }
                        else {
                            $("#Romo").attr("name", "Camera").attr("src", "./img/camera-icon.png");
                            $("#romo-view").hide();
                            $("#local-video").show();
                            _this.emit("message", { type: type, flag: false });
                        }
                        break;
                    case "SwitchCamera":
                        var type = Vehicle.InputType.SwitchCamera;
                        _this.emit("message", { type: type, flag: true });
                        break;
                    case "Button1":
                        var type = Vehicle.InputType.Button1;
                        _this.emit("message", { type: type, flag: true });
                        _this._loadParking();
                        break;
                    case "Mic":
                        if (name === "ON") {
                            $("#Mic").attr("name", "OFF").attr("src", "./img/mic-off-android.png");
                            window.localStream.getAudioTracks()[0].enabled = false;
                        }
                        else {
                            $("#Mic").attr("name", "ON").attr("src", "./img/mic-on-android.png");
                            window.localStream.getAudioTracks()[0].enabled = true;
                        }
                        break;
                    default:
                        break;
                }
            });
        }
        return AndroidUserView;
    })(EventEmitter2);
    Vehicle.AndroidUserView = AndroidUserView;
})(Vehicle || (Vehicle = {}));
