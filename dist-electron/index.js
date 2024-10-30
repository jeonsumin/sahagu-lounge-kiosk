"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const auto_launch_1 = __importDefault(require("auto-launch"));
const fs = __importStar(require("node:fs"));
const width = 1920;
const height = 1080;
let mainWindow = null;
let loadingWindow = null;
//auto-launcher
if (process.platform === 'win32') {
    const autoLauncher = new auto_launch_1.default({
        name: 'lounge-kiosk',
        path: process.execPath,
    });
    // 자동 실행 활성화 여부 확인 후 설정
    autoLauncher
        .isEnabled()
        .then((isEnabled) => {
        if (!isEnabled) {
            autoLauncher.enable(); // 자동 실행 활성화
            console.log('자동 실행 활성화됨');
        }
    })
        .catch((err) => {
        console.error('AutoLaunch Error:', err);
    });
}
electron_1.app.on('ready', () => {
    mainWindow = new electron_1.BrowserWindow({
        width,
        height,
        frame: false,
        kiosk: !electron_is_dev_1.default,
        resizable: false,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    loadingWindow = new electron_1.BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        resizable: false,
        show: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    const port = process.env.PORT || 3000;
    const url = electron_is_dev_1.default
        ? `http://localhost:${port}`
        : path.join(__dirname, '../dist-vite/index.html');
    if (electron_is_dev_1.default) {
        mainWindow?.loadURL(url);
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow?.loadFile(url);
    }
    loadingWindow?.loadFile(path.join(__dirname, '../electron/loading/loading.html'));
    // 메인 페이지가 로드되었을 때 로딩 화면 닫고 메인 화면 표시
    mainWindow.webContents.on('did-finish-load', () => {
        if (loadingWindow) {
            loadingWindow.close(); // 로딩 창 닫기
            loadingWindow = null;
        }
        mainWindow?.show(); // 메인 창 표시
    });
});
// });
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.ipcMain.on('window-close', () => {
    electron_1.app.quit();
});
function filePath() {
    if (electron_is_dev_1.default) {
        const tempPath = path.join(electron_1.app.getAppPath(), 'temp');
        if (!fs.existsSync(tempPath))
            fs.mkdirSync(tempPath);
        return tempPath;
    }
    else {
        return electron_1.app.getPath('documents');
    }
}
// listen the channel `message` and resend the received message to the renderer process
electron_1.ipcMain.on('message', (event) => {
    setTimeout(() => event.sender.send('message', __dirname), 500);
});
electron_1.ipcMain.on('get-file-path', (event) => {
    event.reply('file-save-response', 'fail');
});
//리워드 프린터
electron_1.ipcMain.on('image-print', (event, message) => {
    const printWindow = new electron_1.BrowserWindow({ show: false });
    printWindow.loadURL(`data:text/html,
          <html>
            <body>
              <div>
                <img src="${message.data}" style="width: 100%">
              </div>
            </body>
          </html>`);
    printWindow.webContents.on('did-finish-load', () => {
        printWindow.webContents.print({
            silent: true,
            printBackground: false,
            pageSize: { width: 70000, height: 147800 },
            margins: {
                marginType: 'custom',
                left: 0,
                right: 0,
            },
        }, (success, error) => {
            if (!success) {
                console.error('File save failed:', error);
                event.reply('file-save-response', 'fail');
            }
            printWindow.close();
        });
    });
    event.reply('file-save-response', 'success');
});
function createCSVRow(data) {
    console.log(data);
    const result = {};
    for (const key in data) {
        if (typeof data[key] === 'string') {
            // 문자열일 경우, \n 제거
            result[key] = data[key].replace(/\n/g, '');
        }
        else {
            // 문자열이 아닌 경우 그대로 할당
            result[key] = data[key];
        }
    }
    return `${result[1] || '-'}, ${result[2] || '-'}, ${result[3] || '-'}, ${result[4] || '-'}, ${result['startDate'] || '-'}, ${result['endDate'] || '-'}`;
}
electron_1.ipcMain.on('save-data', (event, message) => {
    const savePath = filePath();
    const filePaths = path.join(savePath, 'lounge_kiosk_data.csv');
    const header = '\uFEFF유형1,유형2,유형3,유형4,시작일, 종료일\n';
    const convert = createCSVRow(message);
    const content = fs.existsSync(filePaths) ? `\n${convert}` : `${header}${convert}`;
    // @ts-ignore
    fs.appendFile(filePaths, content, (err) => {
        if (err) {
            console.log('파일 저장 오류 ::: ', err);
            return;
        }
        console.log('SUCCESS:: ', filePaths);
    });
    event.reply('save-data', 'success');
});
