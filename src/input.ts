import { Browser } from "puppeteer";

export interface WaysToBuy {
  mixed: number[];
  autos: number[];
  lastNumbers: number[];
  mines: number[];
}

export interface BaseInput {
  browser: Browser;
}
export interface LoginInformations extends BaseInput {
  id: string;
  pwd: string;
}
