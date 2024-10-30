import { MutableRefObject } from 'react';

const div = import.meta.env.VITE_DIV;
// const div = process.env.VITE_APP_DIV;
export const commonFunction = {
  startTimer(timer: MutableRefObject<any>, time: number, callBack: () => void) {
    timer.current = setTimeout(callBack, time);
  },

  cancelTimer(timer: MutableRefObject<any>) {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  },

  appBranch(m: any, l: any) {
    return {
      class: div == 'MARKET' ? 'm' : 'l',
      imgSet: div == 'MARKET' ? m : l,
    };
  },
};
