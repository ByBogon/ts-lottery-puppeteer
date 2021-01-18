import * as dotenv from "dotenv";
const dirs = __dirname.split("/")
dirs.pop()
const rootDir = dirs.join("/")
dotenv.config({path: rootDir+"/.env"})

import puppeteer = require("puppeteer");

const LOTTERY_URL: string = process.env.LOTTERY_URL as string;
const userId:string  = process.env.ID as string;
const password:string  = process.env.PASSWORD as string;
const passwordType:string = 'input[type="password"]';

const iframeUrl:string = "https://ol.dhlottery.co.kr/olotto/game/game645.do";

(async () => {
  const limitedArrLength:number = 5;
  let chosenNumbers = [];
  const browser = await puppeteer.launch({ headless: false }); // default is true
  const [page] = await browser.pages();
  await page.goto(LOTTERY_URL, { waitUntil: "networkidle2" });
  await page.type('input[id="userId"]', userId);
  await page.type(passwordType, password);
  await page.click('a[class="btn_common lrg blu"]');
  const popup:Promise<puppeteer.Page> = new Promise(resolve =>
    browser.on("targetcreated", target => resolve(target.page()))
  );
  const newPage = await popup;
  await newPage.close();
  const pages = await browser.pages();

  console.log(pages.length);

  //   await page.hover('li[class="gnb1"]');
  //   await page.click('a[href="javascript:goLottoBuy(2);"', { delay: 3000 });

  await page.goto(iframeUrl);
  //   const lotteryFrame = page
  //     .frames()
  //     .find(frame => frame.name().includes("ifrm_tab"));
  //   console.log(lotteryFrame);
  //   await page.waitForSelector("iframe");

  //   const elementHandle = await page.$("iframe #ifrm_tab");
  //   const frame = await elementHandle.contentFrame();
  //   await frame.waitForSelector('[href="#divWay2Buy3"]');
  await page.click('a[href="#divWay2Buy3"]', { delay: 1000 });
  const fullContent = await page.content();
  console.log(fullContent);

  const firstPrize = fullContent
    .split("<li>")
    .find(c => c.includes("1등 예상 총 당첨금액"));
  console.log(firstPrize);
  const myList:any = await page.$("#myList");
  console.log(myList);
  const myListQ = await page.queryObjects(myList);
  console.log(myListQ);
  //   const myListLength = await page.evaluate(body => body.innerHTML, myList);
  //   console.log(myListLength);
  await myList.dispose();

  const forLoop = async () => {
    for (let i = 1; i < limitedArrLength; i++) {
      const element = await page.waitForSelector(
        `#myList > li:nth-child(${i}) > input[type=checkbox]`,
        { visible: true }
      );
      // console.log(element);

      await element.click();
    }
  };
  forLoop();
  // await page.waitForSelector("li[gnb1]", { visible: true });

  //   const context = await page.content();
  //   console.log(context);

  //   await browser.close();
})();
