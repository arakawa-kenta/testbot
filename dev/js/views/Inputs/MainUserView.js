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
    var MainUserView = (function (_super) {
        __extends(MainUserView, _super);
        function MainUserView(isDouble) {
            var _this = this;
            _super.call(this);
            this._imgArray = [];
            this._isDouble = true;
            this.onData = function (data) {
                if (data.hasOwnProperty(Vehicle.MessageType.CameraPosition)) {
                    _this._cameraPositionChanged(data[Vehicle.MessageType.CameraPosition]);
                }
                if (data.hasOwnProperty(Vehicle.MessageType.ParkingState)) {
                    _this._parkingStateChanged(data[Vehicle.MessageType.ParkingState]);
                }
                if (data.hasOwnProperty(Vehicle.MessageType.AngleState)) {
                    _this._angleStateChanged(data[Vehicle.MessageType.AngleState]);
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
                    $("#SwitchCamera").attr("name", "Back").attr("src", "./img/back-camera.png");
                }
                else {
                    $("#SwitchCamera").attr("name", "Front").attr("src", "./img/front-camera.png");
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
            this._angleStateChanged = function (pos) {
                $("#HeadingtoAngle").val(pos);
            };
            this._isDouble = isDouble;
            //If the Robot is Double, hide Romo's icon
            if (isDouble) {
                $("#Romo").hide();
                $("#Button1").show();
                $("#HeadingtoAngle").attr("disabled", "disabled");
            }
            $("#dashboard-controller button").click(function (evt) {
                $(evt.target).blur();
                var name = $(evt.target).attr('name');
                if (name == "simple") {
                    $("#car-images").show();
                    $(evt.target).attr('name', 'dashboard').removeClass('btn-default').addClass('btn-info').html('mode: dashboard');
                }
                else {
                    $("#car-images").hide();
                    $(evt.target).attr('name', 'simple').removeClass('btn-info').addClass('btn-default').html('mode: simple');
                }
            });
            $("#Shot").click(function (evt) {
                $(evt.target).blur();
                _this._takePhoto();
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
                            $("#Mic").attr("name", "OFF").attr("src", "./img/mic-off.png");
                            window.localStream.getAudioTracks()[0].enabled = false;
                        }
                        else {
                            $("#Mic").attr("name", "ON").attr("src", "./img/mic-on.png");
                            window.localStream.getAudioTracks()[0].enabled = true;
                        }
                        break;
                    default:
                        break;
                }
            });
            $(".head-btn").mousedown(function (evt) {
                $(evt.target).blur();
                var msg = $(evt.target).attr('id');
                _this.emit("message", { type: msg, flag: true });
            }).mouseout(function (evt) {
                $(evt.target).blur();
                var msg = $(evt.target).attr('id');
                _this.emit("message", { type: msg, flag: false });
            }).mouseup(function (evt) {
                $(evt.target).blur();
                var msg = $(evt.target).attr('id');
                _this.emit("message", { type: msg, flag: false });
            });
            $("#HeadingtoAngle").on('input', function (evt) {
                $(evt.target).blur();
                var msg = Vehicle.InputType.HeadingtoAngle;
                var value = Number($(evt.target).val());
                _this.emit("message", { type: msg, flag: true, value: value });
            });
        }
        MainUserView.prototype._takePhoto = function () {
            var $img = this._copyFrame();
            this._imgArray.push($img);
            this._render();
        };
        MainUserView.prototype._render = function () {
            $("#photo-lib").html("");
            for (var i in this._imgArray) {
                $("#photo-lib").append(this._imgArray[i]);
            }
        };
        //copy video tag to canvas and translate DataURL for img tag
        MainUserView.prototype._copyFrame = function () {
            var cEle = $("#tmp-canvas")[0];
            var cCtx = cEle.getContext('2d');
            var $vEle = $('#remote-video');
            cEle.width = $vEle.width();
            cEle.height = $vEle.height();
            var vEle = document.getElementById('remote-video');
            var exp = $vEle.width() / vEle.videoWidth;
            if (this._isDouble && $("#SwitchCamera").attr("name") === "Back") {
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
        return MainUserView;
    })(EventEmitter2);
    Vehicle.MainUserView = MainUserView;
})(Vehicle || (Vehicle = {}));
