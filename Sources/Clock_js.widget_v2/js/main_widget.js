/**
 * Copyright 2021-2022 AVerMedia Technologies Inc. and respective authors and developers.
 * This source code is licensed under the MIT-style license found in the LICENSE file.
 */

const setWidgetSettings = AVT_CREATOR_CENTRAL_API_V2.setWidgetSettings;
const changeWidgetImage = AVT_CREATOR_CENTRAL_API_V2.changeWidgetImage;

let configData = {}; // configs that need to stored in Creator Central
let drawerTimer = -1;

function Calculate(hour, min, sec, ampm){
    let curTime = hour.toString();
    if (min < 10) {
        curTime += ":0" + min.toString();
    } else {
        curTime += ":" + min.toString();
    }
    if (sec < 10) {
        curTime += ":0" + sec.toString();
    } else {
        curTime += ":" + sec.toString();
    }
    return curTime/* + ampm*/;
}

function nowTime(timeZone) {
    let now = new Date();
    let hour_options = {hour: '2-digit', hour12: false, timeZone: timeZone};
    let min_options = {minute: '2-digit', hour12: false, timeZone: timeZone};
    let sec_options = {second: '2-digit', hour12: false, timeZone: timeZone};
    let hour= now.toLocaleString('en-US', hour_options);
    let minute= now.toLocaleString('en-US', min_options);
    let second = now.toLocaleString('en-US', sec_options);
    let ampm = hour <= 11 ? "AM" : "PM";
    return { hour: hour, minute: minute, second: second, ampm: ampm };
}

function drawDigitalClock(context, timeZone) {
    let now = nowTime(timeZone);
    let str = Calculate(now.hour, now.minute, now.second, now.ampm);

    context.beginPath();
    context.font = "32px Arial";
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, 150, 108);
    context.fillStyle = "#000000";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(str, 75, 54);
}

function drawAnalogClock(context, radius, timeZone) {
    context.translate(75, 54); // move to center
    drawFace(context, radius);
    drawTime(context, radius, timeZone);
    context.translate(-75, -54); // move back
}

function drawFace(context, radius) {
    context.beginPath();
    context.fillRect(-75, -54, 150, 108);
    context.arc(0, 0, radius, 0, 2 * Math.PI);
    context.fillStyle = 'white';
    context.fill();

    context.lineWidth = radius * 0.1;
    context.stroke();
    context.beginPath();
    context.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    context.fillStyle = '#333';
    context.fill();

    drawFaceNumbers(context, radius);
}

function drawFaceNumbers(context, radius) {
    let num;

    context.font = radius * 0.15 + "px arial";
    context.textBaseline = "middle";
    context.textAlign = "center";

    for (num = 1; num < 13; num++){
        let ang = num * Math.PI / 6;
        context.rotate(ang);
        context.translate(0, -radius * 0.85);
        context.rotate(-ang);
        context.fillText(num.toString(), 0, 0);
        context.rotate(ang);
        context.translate(0, radius * 0.85);
        context.rotate(-ang);
    }
}

function drawTime(context, radius, timeZone){
    let now = nowTime(timeZone);

    //hour
    let hour = now.hour % 12;
    hour = (hour * Math.PI / 6) + (now.minute * Math.PI / (6 * 60)) + (now.second * Math.PI / (360 * 60));
    drawHand(context, hour, radius * 0.5, radius * 0.07);

    //minute
    let minute = (now.minute * Math.PI / 30) + (now.second * Math.PI / (30 * 60));
    drawHand(context, minute, radius * 0.8, radius * 0.07);

    // second
    let second = (now.second * Math.PI / 30);
    drawHand(context, second, radius * 0.9, radius * 0.02);
}

function drawHand(context, pos, length, width) {
    context.beginPath();
    context.lineWidth = width;
    context.lineCap = "round";
    context.moveTo(0,0);
    context.rotate(pos);
    context.lineTo(0, -length);
    context.stroke();
    context.rotate(-pos);
}

function drawClock(type) {
    const clock = document.getElementById("canvas_clock");
    const context = clock.getContext("2d");
    const radius = clock.height / 2  * 0.90;
    context.clearRect(0, 0, clock.width, clock.height);

    if (type == 'analog') {
        drawAnalogClock(context, radius, 'Asia/Taipei');
    } else {
        drawDigitalClock(context, 'Asia/Taipei');
    }

    return clock.toDataURL('image/png', 1);
}

function refreshWidgetUi(uuid, config) {
    let widget = config["widget"];
    let image = drawClock(config["type"]);
    changeWidgetImage(widget, uuid, image);
}

function drawRunner() {
    let widgets = Object.entries(configData);
    for (const [uuid, config] of widgets) {
        refreshWidgetUi(uuid, config);
    }
}

/**
 * Event received after sending the getWidgetSettings event to retrieve
 * the persistent data stored for the widget.
 */
AVT_CREATOR_CENTRAL.on('didReceiveWidgetSettings', data => {
    let widget = data["widget"];
    let uuid = data["context"];
    let payload = data["payload"];

    configData[uuid] = payload; // cache the settings for future use
    configData[uuid].widget = widget; // pass widget name in json
    refreshWidgetUi(uuid, configData[uuid]); // refresh widget if necessary
});

/**
 * When an instance of a widget is displayed on Creator Central, for example,
 * when the profile loaded, the package will receive a willAppear event.
 */
AVT_CREATOR_CENTRAL.on('widgetWillAppear', data => {
    let uuid = data["context"];

    configData[uuid] = {};
    // set the drawer timer to start, wait onWidgetSettings to get full config
    if (drawerTimer < 0) { // no timer before, start drawer timer
        drawerTimer = setInterval(drawRunner, 1000);
    }
});

/**
 * When switching profile, an instance of a widget will be invisible,
 * the package will receive a willDisappear event.
 */
AVT_CREATOR_CENTRAL.on('widgetWillDisappear', data => {
    let uuid = data["context"];

    delete configData[uuid];
    // stop the drawer timer
    if (Object.entries(configData) <= 0) { // no widgets need to be updated
        clearInterval(drawerTimer); // stop the timer
        drawerTimer = -1; // reset drawer timer
    }
});

/**
 * When the user presses a display view and then releases within it, the package
 * will receive the widgetTriggered event.
 */
AVT_CREATOR_CENTRAL.on('actionTriggered', data => {
    let widget = data["widget"];
    let uuid = data["context"];

    // make sure the widget is clickable
    if (configData[uuid] != null) {
        let type = configData[uuid]["type"];
        switch (type) {
            case 'digital':
                configData[uuid]["type"] = 'analog';
                break;
            case 'analog':
                configData[uuid]["type"] = 'digital';
                break;
        }
        setWidgetSettings(widget, uuid, widgetJson); // it will trigger didReceiveWidgetSettings
    }
});

/**
 * Creator Central entry point
 */
function connectCreatorCentral(port, uuid, inEvent, inInfo) {
    AVT_CREATOR_CENTRAL.connect(port, uuid, inEvent, inInfo, null);
}
