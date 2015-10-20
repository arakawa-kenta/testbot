var Vehicle;
(function (Vehicle) {
    (function (InputType) {
        InputType[InputType["Front"] = "DrivingForward"] = "Front";
        InputType[InputType["Back"] = "DrivingBackward"] = "Back";
        InputType[InputType["Right"] = "RotatingRight"] = "Right";
        InputType[InputType["Left"] = "RotatingLeft"] = "Left";
        InputType[InputType["Button1"] = "Button1"] = "Button1";
        InputType[InputType["Button2"] = "Button2"] = "Button2";
        InputType[InputType["Button3"] = "Button3"] = "Button3";
        InputType[InputType["Button4"] = "Button4"] = "Button4";
        InputType[InputType["Button5"] = "Button5"] = "Button5";
        InputType[InputType["Button6"] = "Button6"] = "Button6";
        InputType[InputType["HeadUp"] = "HeadingUp"] = "HeadUp";
        InputType[InputType["HeadDown"] = "HeadingDown"] = "HeadDown";
        InputType[InputType["HeadingtoAngle"] = "HeadingtoAngle"] = "HeadingtoAngle";
        InputType[InputType["GearUp"] = "GearUp"] = "GearUp";
        InputType[InputType["GearDown"] = "GearDown"] = "GearDown";
        InputType[InputType["Romo"] = "Romo"] = "Romo";
        InputType[InputType["SwitchCamera"] = "SwitchCamera"] = "SwitchCamera";
        InputType[InputType["GetCamera"] = "GetCamera"] = "GetCamera";
        InputType[InputType["GetVehicleStatus"] = "GetVehicleStatus"] = "GetVehicleStatus";
        InputType[InputType["Shot"] = "Shot"] = "Shot";
        InputType[InputType["Wiper"] = "Wiper"] = "Wiper";
        InputType[InputType["Mic"] = "Mic"] = "Mic";
        InputType[InputType["Misc"] = "Misc"] = "Misc";
    })(Vehicle.InputType || (Vehicle.InputType = {}));
    var InputType = Vehicle.InputType;
})(Vehicle || (Vehicle = {}));
