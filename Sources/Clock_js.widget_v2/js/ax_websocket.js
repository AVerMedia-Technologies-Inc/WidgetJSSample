/**
 * Copyright 2021-2022 AVerMedia Technologies Inc. and respective authors and developers.
 * This source code is licensed under the MIT-style license found in the LICENSE file.
 *
 * https://github.com/AVerMedia-Technologies-Inc/CreatorCentralSDK/blob/main/RegistrationFlow.md
 */

window.AVT_CREATOR_CENTRAL;
window.REQUEST_SEQ_ID = 0;

WebSocket.prototype.sendJSON = function(jsn, log) {
    if (log) {
        console.log('SendJSON', this, jsn);
    }
    this.send(JSON.stringify(jsn));
};

class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, listener) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return () => this.removeListener(event, listener);
    }
    
    removeListener(event, listener) {
        if (typeof this.events[event] === 'object') {
            const idx = this.events[event].indexOf(listener);
            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }
    
    emit(event, ...args) {
        if (typeof this.events[event] === 'object') {
            this.events[event].forEach(listener => listener.apply(this, args));
        }
    }
    
    once(event, listener) {
        const remove = this.on(event, (...args) => {
            remove();
            listener.apply(this, args);
        });
    }
};

const AVT_CREATOR_CENTRAL_API_V2 = {
    queue : {},

    send: function (apiType, payload, widget, uuid) {
        let context = uuid != null ? uuid: AVT_CREATOR_CENTRAL.uuid;
        let pl = {
            event : apiType,
            context : context
        };
        if (payload) {
            pl.payload = payload;
        }
        if (widget) {
            pl.widget = widget;
        }

        AVT_CREATOR_CENTRAL.connection && AVT_CREATOR_CENTRAL.connection.sendJSON(pl);
    },

    setWidgetSettings: function(widget, uuid, payload) {
        AVT_CREATOR_CENTRAL_API_V2.send('setWidgetSettings', payload, widget, uuid);
    },
    changeWidgetImage: function (widget, uuid, image) {
        let payload = {"image": image};
        AVT_CREATOR_CENTRAL_API_V2.send('changeImage', payload, widget, uuid);
    }
};

// main
AVT_CREATOR_CENTRAL = (function() {
    function parseJson (jsonString) {
        if (typeof jsonString === 'object') return jsonString;
        try {
            const o = JSON.parse(jsonString);
            if (o && typeof o === 'object') {
                return o;
            }
        } catch (e) {}
        return false;
    }

    function init() {
        let inPort, inUUID, inMessageType, inWidgetInfo;
        let websocket = null;
        let events = new EventEmitter();

        function connect(port, uuid, inEvent, inInfo, widgetInfo) {
            inPort = port;
            inUUID = uuid;
            inMessageType = inEvent;
            inWidgetInfo = widgetInfo;
            
            websocket = new WebSocket(`ws://localhost:${inPort}`);

            websocket.onopen = function() {
                let json = {
                    event : inMessageType,
                    uuid: inUUID
                };
                
                AVT_CREATOR_CENTRAL_API_V2.queue[REQUEST_SEQ_ID] = inMessageType + '.result';
                websocket.sendJSON(json);
                
                AVT_CREATOR_CENTRAL.uuid = inUUID;
                AVT_CREATOR_CENTRAL.connection = websocket;
                
                events.emit('webSocketConnected', {
                    port: inPort,
                    uuid: inUUID,
                    widget: inWidgetInfo,
                    connection: websocket
                });
            };

            websocket.onerror = function(evt) {
                console.warn('WEBOCKET ERROR', evt, evt.data);
            };

            websocket.onclose = function(evt) {
                console.warn('error', evt); // Websocket is closed
            };

            websocket.onmessage = function(evt) {
                if (evt.data) {
                    let jsonObj = parseJson(evt.data);
                    events.emit(jsonObj.event, jsonObj);
                }
            };
        }

        return {
            connect: connect,
            uuid: inUUID,
            widget: inWidgetInfo,
            on: (event, callback) => events.on(event, callback),
            emit: (event, callback) => events.emit(event, callback),
            connection: websocket
        };
    }

    return init();
})();
