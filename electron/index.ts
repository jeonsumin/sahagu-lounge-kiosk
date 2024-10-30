import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import * as path from 'path';
import isDev from 'electron-is-dev';
import AutoLaunch from 'auto-launch';
import * as fs from 'node:fs'

const width = 1920;
const height = 1080;
let mainWindow: BrowserWindow | null = null;
let loadingWindow: BrowserWindow | null = null;

//auto-launcher
if (process.platform === 'win32') {
  const autoLauncher = new AutoLaunch({
    name: 'lounge-kiosk',
    path: process.execPath,
  });
  // 자동 실행 활성화 여부 확인 후 설정
  autoLauncher
    .isEnabled()
    .then((isEnabled: boolean) => {
      if (!isEnabled) {
        autoLauncher.enable(); // 자동 실행 활성화
        console.log('자동 실행 활성화됨');
      }
    })
    .catch((err: any) => {
      console.error('AutoLaunch Error:', err);
    });
}
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    kiosk: !isDev,
    resizable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  loadingWindow = new BrowserWindow({
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

  const port: string | 3000 = process.env.PORT || 3000;
  const url = isDev
    ? `http://localhost:${port}`
    : path.join(__dirname, '../dist-vite/index.html');

  if (isDev) {
    mainWindow?.loadURL(url);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow?.loadFile(url);
  }

  loadingWindow?.loadFile(
    path.join(__dirname, '../electron/loading/loading.html')
  );

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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('window-close', () => {
  app.quit();
});

function filePath() {
  if (isDev) {
    const tempPath = path.join(app.getAppPath(), 'temp');
    if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);
    return tempPath;
  } else {
    return app.getPath('documents');
  }
}

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent) => {
  setTimeout(() => event.sender.send('message', __dirname), 500);
});

ipcMain.on('get-file-path', (event: IpcMainEvent) => {
  event.reply('file-save-response', 'fail');
});

//리워드 프린터
ipcMain.on('image-print', (event: IpcMainEvent, message: any) => {
  const printWindow = new BrowserWindow({ show: false });

  printWindow.loadURL(`data:text/html,
          <html>
            <body>
              <div>
                <img src="${message.data}" style="width: 100%">
              </div>
            </body>
          </html>`);

  printWindow.webContents.on('did-finish-load', () => {
    printWindow.webContents.print(
      {
        silent: true,
        printBackground: false,
        pageSize: { width: 70000, height: 147800 },
        margins: {
          marginType: 'custom',
          left: 0,
          right: 0,
        },
      },
      (success, error) => {
        if (!success) {
          console.error('File save failed:', error);
          event.reply('file-save-response', 'fail');
        }
        printWindow.close();
      }
    );
  });

  event.reply('file-save-response', 'success');
});

function createCSVRow(data: { [key: string]: string }) {
  console.log(data);
  const result: { [key: string]: any } = {};

  for (const key in data) {
    if (typeof data[key] === 'string') {
      // 문자열일 경우, \n 제거
      result[key] = data[key].replace(/\n/g, '');
    } else {
      // 문자열이 아닌 경우 그대로 할당
      result[key] = data[key];
    }
  }
  return `${result[1] || '-'}, ${result[2] || '-'}, ${result[3] || '-'}, ${result[4] || '-'}, ${result['startDate'] || '-'}, ${result['endDate'] || '-'}`
}

ipcMain.on('save-data', (event: IpcMainEvent, message: any) => {
  const savePath = filePath();
  const filePaths = path.join(savePath, 'lounge_kiosk_data.csv');

  const header = '\uFEFF유형1,유형2,유형3,유형4,시작일, 종료일\n';
  const convert = createCSVRow(message);
  const content = fs.existsSync(filePaths) ? `\n${convert}` : `${header}${convert}`;

  // @ts-ignore
  fs.appendFile(filePaths, content, (err: any) => {
    if (err) {
      console.log('파일 저장 오류 ::: ', err);
      return;
    }
    console.log('SUCCESS:: ', filePaths);
  });

  event.reply('save-data', 'success');
});
