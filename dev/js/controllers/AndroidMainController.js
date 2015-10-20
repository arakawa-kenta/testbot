/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../views/Inputs/UserInputs.ts" />
/// <reference path="../views/Inputs/VehicleMessage.ts" />
/// <reference path="../views/Inputs/Gamepad.ts" />
/// <reference path="../views/Inputs/Keyboard.ts" />
/// <reference path="../views/Inputs/RaceDashboard.ts" />
/// <reference path="../views/Inputs/AndroidUserView.ts" />
/// <reference path="../models/PeerManager.ts" />
var Vehicle;
(function (Vehicle) {
    var AndroidMainController = (function () {
        function AndroidMainController(type, $local_video_dom, $remote_video_dom) {
            var _this = this;
            this._onInput = function (inputs) {
                var list = _this._androidUserView.getMsgList();
                if (list.indexOf(String(inputs.type)) >= 0) {
                    _this._androidUserView.onInput(inputs);
                }
                else {
                    _this._send(inputs);
                }
            };
            this._openDataConnection = function () {
                _this._androidUserView.addListener("message", _this._send);
                var msg = { type: Vehicle.InputType.GetCamera, flag: true };
                _this._peerManager.sendData(msg);
                //get vehicle state
                setTimeout(function () {
                    msg = { type: Vehicle.InputType.GetVehicleStatus, flag: true };
                    _this._send(msg);
                }, 1000);
            };
            this._send = function (inputs) {
                _this._peerManager.sendData(inputs);
            };
            var args = this._get_url_vars();
            this._emitters = {};
            this._androidUserView = new Vehicle.AndroidUserView(args["Double"]);
            this._raceDashboard = new Vehicle.RaceDashboard(args["Double"]);
            if (!("peerId" in args)) {
                window.alert("Please specify the peer ID (with URL query)");
                return;
            }
            var peerId = args["peerId"];
            this._peerManager = new Vehicle.PeerManager(peerId);
            if (type == "video") {
                this._setupVideo(peerId, true, true, $local_video_dom, $remote_video_dom);
                this._setupData(peerId);
            }
            else if (type === "mute") {
                this._setupVideo(peerId, true, false, $local_video_dom, $remote_video_dom);
                this._setupData(peerId);
            }
        }
        AndroidMainController.prototype._setupVideo = function (peerId, videoFlag, audioFlag, $local_video_dom, $remote_video_dom) {
            this._peerManager.setupVideo(peerId, videoFlag, audioFlag, $local_video_dom, $remote_video_dom);
        };
        AndroidMainController.prototype._setupData = function (peerId) {
            //init GamePad and listen event
            var gamepad = new Vehicle.Gamepad();
            gamepad.addListener("inputs", this._onInput);
            this._emitters["gamepad"] = gamepad;
            //init keyboard and listen event
            var keyboard = new Vehicle.Keyboard();
            keyboard.addListener("inputs", this._onInput);
            this._emitters["keyboard"] = keyboard;
            this._peerManager.setupData(peerId, 'portrait');
            this._peerManager.addListener("dataChannel-open", this._openDataConnection);
            this._peerManager.addListener("dataChannel-data", this._raceDashboard.onData);
            this._peerManager.addListener("dataChannel-data", this._androidUserView.onData);
        };
        AndroidMainController.prototype._get_url_vars = function () {
            var args = {};
            var temp_params = window.location.search.substring(1).split('&');
            for (var i = 0; i < temp_params.length; i++) {
                var params = temp_params[i].split('=');
                args[params[0]] = params[1];
                if (params[1].indexOf("Double") === 0) {
                    args["Double"] = true;
                }
            }
            return args;
        };
        return AndroidMainController;
    })();
    Vehicle.AndroidMainController = AndroidMainController;
})(Vehicle || (Vehicle = {}));
