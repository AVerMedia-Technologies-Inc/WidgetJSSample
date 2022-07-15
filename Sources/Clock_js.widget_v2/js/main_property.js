/**
 * Copyright 2021-2022 AVerMedia Technologies Inc. and respective authors and developers.
 * This source code is licensed under the MIT-style license found in the LICENSE file.
 *
 * https://github.com/AVerMedia-Technologies-Inc/CreatorCentralSDK/blob/main/RegistrationFlow.md
 *
 * Include this script AFTER ax_property.js
 */

const setWidgetSettings = AVT_CREATOR_CENTRAL_API_V2.setWidgetSettings;

let widgetUuid = "";
let widgetName = "";

/**
 * WebSocket connected
 */
AVT_CREATOR_CENTRAL.on('webSocketConnected', data => {
    let port = data["port"];
    let uuid = data["uuid"];
    let widgetInfo = data["widget"];

    widgetUuid = widgetInfo["context"];
    widgetName = widgetInfo["widget"];
});

/**
 * Event received after sending the getWidgetSettings event to retrieve
 * the persistent data stored for the widget.
 */
AVT_CREATOR_CENTRAL.on('didReceiveWidgetSettings', data => {
    let payload = data["payload"];
    if (payload["type"] != null) {
        $("#js_type").val(payload["type"]);
    }
});

function saveWidgetSettings() {
    // refresh value from GUI
    const type = $("#js_type").val();

    let widgetJson = { "type":  type };
    setWidgetSettings(widgetName, widgetUuid, widgetJson);
}

$(document).ready(function(){
    $("#js_type").change(saveWidgetSettings);
});

/**
 * Creator Central entry point
 */
function connectCreatorCentral(port, uuid, inEvent, inInfo, inWidgetInfo) {
    AVT_CREATOR_CENTRAL.connect(port, uuid, inEvent, inInfo, inWidgetInfo);
}
