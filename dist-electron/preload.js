"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('ipcRenderer', electron_1.ipcRenderer);
const api = {
    send: (channel, data) => {
        electron_1.ipcRenderer.send(channel, data);
    },
    sendMessage: (message) => {
        electron_1.ipcRenderer.send('message', message);
    },
    Close: () => {
        electron_1.ipcRenderer.send('window-close');
    },
    on: (channel, callback) => {
        electron_1.ipcRenderer.on(channel, (_, data) => callback(data));
    },
};
electron_1.contextBridge.exposeInMainWorld('Main', api);
