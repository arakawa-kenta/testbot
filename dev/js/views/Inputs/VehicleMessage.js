var Vehicle;
(function (Vehicle) {
    (function (MessageType) {
        MessageType[MessageType["VehicleBattery"] = "VehicleBattery"] = "VehicleBattery";
        MessageType[MessageType["IOSBattery"] = "IOSBattery"] = "IOSBattery";
        MessageType[MessageType["CameraPosition"] = "CameraPosition"] = "CameraPosition";
        MessageType[MessageType["ParkingState"] = "ParkingState"] = "ParkingState";
        MessageType[MessageType["AngleState"] = "AngleState"] = "AngleState";
    })(Vehicle.MessageType || (Vehicle.MessageType = {}));
    var MessageType = Vehicle.MessageType;
})(Vehicle || (Vehicle = {}));
