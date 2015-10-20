/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../views/Inputs/UserInputs.ts" />
/// <reference path="../views/Inputs/VehicleMessage.ts" />
/// <reference path="../views/Inputs/Gamepad.ts" />
/// <reference path="../views/Inputs/Keyboard.ts" />
/// <reference path="../views/Inputs/RaceDashboard.ts" />
/// <reference path="../views/Inputs/MainUserView.ts" />
/// <reference path="../models/PeerManager.ts" />
var Vehicle;
(function (Vehicle) {
    var MainController = (function () {
        function MainController(type, $local_video_dom, $remote_video_dom) {
            var _this = this;
            this._onInput = function (inputs) {
                var list = _this._mainUserView.getMsgList();
                if (list.indexOf(String(inputs.type)) >= 0) {
                    _this._mainUserView.onInput(inputs);
                }
                else {
                    if (inputs.type === Vehicle.InputType.Front || inputs.type === Vehicle.InputType.Back) {
                        inputs.value = _this._raceDashboard.getGearValue();
                    }
                    _this._send(inputs);
                }
                _this._raceDashboard.onInput(inputs);
            };
            this._openDataConnection = function () {
                _this._mainUserView.addListener("message", _this._send);
                _this._raceDashboard.addListener("message", _this._send);
                var msg = { type: Vehicle.InputType.GetCamera, flag: true };
                _this._send(msg);
                //get vehicle state
                setTimeout(function () {
                    msg = { type: Vehicle.InputType.GetVehicleStatus, flag: true };
                    _this._send(msg);
                }, 1000);
                setInterval(function () {
                    _this._send(msg);
                }, 60000);
            };
            this._send = function (inputs) {
                _this._peerManager.sendData(inputs);
            };
            var args = this._get_url_vars();
            this._emitters = {};
            this._mainUserView = new Vehicle.MainUserView(args["Double"]);
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
        MainController.prototype._setupVideo = function (peerId, videoFlag, audioFlag, $local_video_dom, $remote_video_dom) {
            this._peerManager.setupVideo(peerId, videoFlag, audioFlag, $local_video_dom, $remote_video_dom);
        };
        MainController.prototype._setupData = function (peerId) {
            //init GamePad and listen event
            var gamepad = new Vehicle.Gamepad();
            gamepad.addListener("inputs", this._onInput);
            this._emitters["gamepad"] = gamepad;
            //init keyboard and listen event
            var keyboard = new Vehicle.Keyboard();
            keyboard.addListener("inputs", this._onInput);
            this._emitters["keyboard"] = keyboard;
            this._peerManager.setupData(peerId, 'landscape');
            this._peerManager.addListener("dataChannel-open", this._openDataConnection);
            this._peerManager.addListener("dataChannel-data", this._raceDashboard.onData);
            this._peerManager.addListener("dataChannel-data", this._mainUserView.onData);
        };
        MainController.prototype._get_url_vars = function () {
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
        return MainController;
    })();
    Vehicle.MainController = MainController;
})(Vehicle || (Vehicle = {}));
