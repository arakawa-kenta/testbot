/// <reference path="../../typings/tsd.d.ts" />
var Vehicle;
(function (Vehicle) {
    var Index = (function () {
        function Index() {
            this._APIkey = "d7d74365-a4ed-4a70-be20-19917228dad3";
            this._peer = new Peer({
                key: this._APIkey
            });
        }
        Index.prototype.listAllPeers = function (callback) {
            this._peer.listAllPeers(function (items) {
                var peerIds = [];
                //only peerIDs that contain the substring "Romo" or "Double"
                _.each(items, function (element, index, array) {
                    if (element.indexOf('Romo') === 0) {
                        peerIds.push(element);
                    }
                    else if (element.indexOf('Double') === 0) {
                        peerIds.push(element);
                    }
                });
                callback(peerIds);
            });
        };
        Index.prototype.listItems = function (callback) {
            var _this = this;
            this.listAllPeers(function (items) {
                var tag = "";
                //create table
                _.each(items, function (element, index, array) {
                    tag += "<table class='peer-list'><tr><th>" + _this._peerURLDecode(element) + "</th>";
                    var allLink = '<td class="PConly"><a href="/all.html?peerId=' + element + '"><button class="btn btn-success btn-lg">ALL <i class="fa fa-laptop"></i></button></a></td>';
                    var raceLink = '<td class="PConly"><a href="/race.html?peerId=' + element + '"><button class="btn btn-warning btn-lg">Race <i class="fa fa-car"></i></button></a></td>';
                    var androidLink = '<td><a href="/android.html?peerId=' + element + '"><button class="btn btn-danger btn-lg">Android <i class="fa fa-mobile"></i></button></a></td>';
                    tag += allLink + androidLink + raceLink + "</tr></table>";
                });
                //if not find any device
                if (tag === "") {
                    tag = '<div class="alert alert-danger" role="alert"><i class="fa fa-bell"> Can\'t find any devices to connect to</i></div>';
                }
                callback(tag);
            });
        };
        Index.prototype._peerURLDecode = function (peerId) {
            //We cannot use "%" for peerID, so change "%" to "__" on DrivingVehicle App
            peerId = peerId.replace(/__/g, "%");
            peerId = decodeURI(peerId);
            return peerId;
        };
        return Index;
    })();
    Vehicle.Index = Index;
})(Vehicle || (Vehicle = {}));
