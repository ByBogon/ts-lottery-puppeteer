import { Browser } from "puppeteer";

export const input = {
  waysToBuy: {
    // 혼합선택
    "0": {},

    // 자동번호 발급
    "1": {},

    //직전회차번호
    "2": {},

    //나의 로또 번호
    "3": {}
  }
};

export interface BaseInput {
  browser: Browser;
}
export interface LoginInformations extends BaseInput {
  id: string;
  pwd: string;
}
