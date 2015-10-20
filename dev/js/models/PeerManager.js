/// <reference path="../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vehicle;
(function (Vehicle) {
    var PeerManager = (function (_super) {
        __extends(PeerManager, _super);
        function PeerManager(peerId) {
            _super.call(this);
            this._APIkey = "d7d74365-a4ed-4a70-be20-19917228dad3";
            this._peer = new Peer({
                key: this._APIkey
            });
            this._checkPeerId(this._peer, peerId, function (flag) {
                if (!flag) {
                    window.alert("Could not find the vehicle's peer ID");
                    return;
                }
            });
        }
        PeerManager.prototype._checkPeerId = function (peer, peerId, callback) {
            peer.on("open", function () {
                peer.listAllPeers(function (items) {
                    var flag = false;
                    for (var i in items) {
                        if (items[i] === peerId) {
                            flag = true;
                            break;
                        }
                    }
                    callback(flag);
                });
            });
        };
        PeerManager.prototype.setupVideo = function (peerId, videoFlag, audioFlag, $local_video_dom, $remote_video_dom) {
            var _this = this;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            this._peer.on('error', function (err) {
            });
            navigator.getUserMedia({ audio: audioFlag, video: videoFlag }, function (stream) {
                // Set your video displays
                $local_video_dom.prop('src', URL.createObjectURL(stream));
                window.localStream = stream;
                var call = _this._peer.call(peerId, stream);
                call.on('stream', function (stream) {
                    _this.emit("mediaConnection-open", null);
                    $remote_video_dom.prop('src', URL.createObjectURL(stream));
                });
            }, function () {
                alert("Failed to access the webcam and microphone.");
            });
        };
        PeerManager.prototype.setupData = function (peerId, orient) {
            var _this = this;
            //connect data channel
            this._dataChannel = this._peer.connect(peerId, {
                label: orient,
                serialization: 'binary',
                reliable: false
            });
            //data channel onopen
            this._dataChannel.on('open', function () {
                _this._dataChannel.on('data', function (data) {
                    console.log(data);
                    _this.emit("dataChannel-data", data);
                });
                _this.emit("dataChannel-open", null);
            });
        };
        PeerManager.prototype.sendData = function (message) {
            console.log(message);
            this._dataChannel.send(message);
        };
        return PeerManager;
    })(EventEmitter2);
    Vehicle.PeerManager = PeerManager;
})(Vehicle || (Vehicle = {}));
