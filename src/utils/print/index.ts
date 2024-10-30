class PhotoPrinterController {

  cmdList: any;
  setPort: any;
  printInit: any;
  setClean: any;
  setClose: any;
  iIndex: number;

  constructor() {
    this.cmdList = { cmd_List: [] };
    this.setPort = { name: 'SetUsbportauto', value: [] };
    this.printInit = { name: 'SetInit', value: [] };
    this.setClean = { name: 'SetClean', value: [] };
    this.setClose = { name: 'SetClose', value: [] };
    this.iIndex = 0;
  }

  init = () => {
    this.cmdList['cmd_List'][this.iIndex++] = this.setPort;
    this.cmdList['cmd_List'][this.iIndex++] = this.printInit;
    this.cmdList['cmd_List'][this.iIndex++] = this.setClean;

  };
  //TODO: Electron Image Path 설정
  PrintRewardPhoto = (params: any) => {

    this.rewardUI('PrintDiskimgfile','strPath',`${params.dirname}\\title_rounge.jpg`,true);
    this.rewardUI('PrintFeedDot', 'Lnumber', '80', false);

    this.rewardUI('PrintDiskimgfile', 'strPath', `${params.dirname}\\${params.img}`, true);

    this.rewardUI('PrintFeedDot', 'Lnumber','80',false );
    this.rewardUI('PrintString', 'strData','************************************************',true );
    this.rewardUI('PrintFeedDot', 'Lnumber','80',false );

    this.rewardUI('SetAlignment', 'iAlignment', '1', true);
    this.rewardUI('PrintString', 'strData',params.text,true );

    this.rewardUI('PrintFeedDot', 'Lnumber','80',false );
    this.rewardUI('PrintString', 'strData','************************************************',true );
    this.rewardUI('PrintFeedDot', 'Lnumber','80',false );

    this.rewardUI('PrintDiskimgfile', 'strPath',`${params.dirname}\\reward_logo.jpg`,true );
    this.rewardUI('PrintFeedDot', 'Lnumber', '160', false);

    this.rewardUI('PrintCutpaper', 'iMode', '0' ,false );
    this.cmdList['cmd_List'][this.iIndex++] = this.setClose;

    const str = JSON.stringify(this.cmdList);
    const param = encodeURI(str);

    this.send(param)
    // return param;
  };

  send = (encodingData: string ) => {
    // const js = FC.PrintRewardPhoto('중요한 건 꺾였는데도 그냥 하는 마음','http://localhost:3000/src/assets/img/reward_logo.jpg')

    const httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', 'http://localhost:61000', true);
    httpRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

    httpRequest.send(encodingData);

    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        const json = httpRequest.responseText;//获取到服务端返回的数据
      }
    };
  }
  unmount = () => {
    this.cmdList = { cmd_List: [] };
    this.iIndex = 0;
  };

  rewardUI = (
    title: string,
    option: string,
    values: string,
    isImme: boolean
  ) => {
    const data = { name: title, value: [] };
    let jsonText: any = {};
    jsonText[option] = values;
    // @ts-ignore
    data.value.push(jsonText);
    if (isImme) {
      jsonText = {};
      jsonText['iImme'] = '0';
      // @ts-ignore
      data.value.push(jsonText);
    }
    this.cmdList['cmd_List'][this.iIndex++] = data;
  };
}

export const PhotoPrinterControl = new PhotoPrinterController();
