import * as puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { LoginInformations, WaysToBuy } from "./input";
import { UserInformation } from "./output";

export const getUserInformation = async (
  page: puppeteer.Page
): Promise<UserInformation> => {
  const LOTTERY_URL: string = process.env.LOTTERY_URL as string;
  const content = await page.content();
  const $ = cheerio.load(content);

  const depositMoneyHTML = $(
    "body > div:nth-child(1) > header > div.header_con > div.top_menu > form > div > ul.information > li > a:nth-child(2) > strong"
  ).text();

  const depositMoney: number = parseInt(
    depositMoneyHTML.slice(0, depositMoneyHTML.length - 1).replace(/,/g, "")
  );
  console.log(`DepositMoney: ${depositMoney}`);

  const myPageURL = $(
    "body > div:nth-child(1) > header > div.header_con > div.top_menu > form > div > ul.account > li:nth-child(2) > a[href]"
  ).get()[0].attribs.href;
  console.log(myPageURL);
  await page.goto(LOTTERY_URL + myPageURL, { waitUntil: "networkidle2" });

  const myPageContent = await page.content();
  const $MyPage = cheerio.load(myPageContent);

  const bankAccount = $MyPage(
    "#article > div:nth-child(2) > div > div.box_information > div.box.money > div.total_account_number > table > tbody > tr:nth-child(1) > td"
  ).text();
  console.log(bankAccount);

  return { depositMoney, bankAccount };
};

export const signIn = async ({
  id,
  pwd,
  browser
}: LoginInformations): Promise<puppeteer.Page> => {
  const LOTTERY_URL: string = process.env.LOTTERY_URL as string;
  const userId: string = (process.env.ID as string) || id;
  const password: string = (process.env.PASSWORD as string) || pwd;
  const idType: string = 'input[id="userId"]';
  const passwordType: string = 'input[type="password"]';

  const page = await browser.newPage();
  await page.setViewport({
    width: 1366,
    height: 768
  });
  await page.goto(LOTTERY_URL, { waitUntil: "networkidle2" });

  const content = await page.content();
  const $ = cheerio.load(content);

  const loginPageURL = $(
    "body > div:nth-child(1) > header > div.header_con > div.top_menu > form > div > ul > li.log > a[href]"
  ).get()[0].attribs.href;
  await page.goto(LOTTERY_URL + loginPageURL, { waitUntil: "networkidle2" });

  await page.type(idType, userId);
  await page.type(passwordType, password);
  await page.click('a[class="btn_common lrg blu"]');
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  return page;
};

export const buyLottery = async (
  page: puppeteer.Page,
  waysToBuy: WaysToBuy
) => {
  const iframeUrl: string = "https://ol.dhlottery.co.kr/olotto/game/game645.do";

  const limitedArrLength: number = 5;
  let chosenNumbers = [];

  const content = await page.content();

  const $ = cheerio.load(content);

  await page.click("#gnb > ul > li.gnb1");
  await page.click(".gnb1_1");

  const result = await page.waitForNavigation({ waitUntil: "networkidle2" });

  result.url;
  const waysToBuyHTML = $("#tabWay2Buy");

  const waysToBuyURLs = waysToBuyHTML.map((index, list) => {
    console.log(`index: ${index}`);
    const url = $(list)
      .find(`#num${index + 1}`)
      .get()[0].attribs.href;
    console.log(url);
    return url;
  });
  console.log(waysToBuyURLs);

  // const popup:Promise<puppeteer.Page> = new Promise(resolve =>
  //   browser.on("targetcreated", target => resolve(target.page()))
  // );
  // const newPage = await popup;
  // console.log(newPage)
  // if (newPage) {
  //   await newPage.close();
  // }
  // const pages = await browser.pages();

  // console.log(pages.length);

  // //   await page.hover('li[class="gnb1"]');
  // //   await page.click('a[href="javascript:goLottoBuy(2);"', { delay: 3000 });

  // await page.goto(iframeUrl);
  // //   const lotteryFrame = page
  // //     .frames()
  // //     .find(frame => frame.name().includes("ifrm_tab"));
  // //   console.log(lotteryFrame);
  // //   await page.waitForSelector("iframe");

  // //   const elementHandle = await page.$("iframe #ifrm_tab");
  // //   const frame = await elementHandle.contentFrame();
  // //   await frame.waitForSelector('[href="#divWay2Buy3"]');
  // await page.click('a[href="#divWay2Buy3"]', { delay: 1000 });
  // const fullContent = await page.content();
  // console.log(fullContent);

  // const firstPrize = fullContent
  //   .split("<li>")
  //   .find(c => c.includes("1등 예상 총 당첨금액"));
  // console.log(firstPrize);
  // const myList:any = await page.$("#myList");
  // console.log(myList);
  // const myListQ = await page.queryObjects(myList);
  // console.log(myListQ);
  // //   const myListLength = await page.evaluate(body => body.innerHTML, myList);
  // //   console.log(myListLength);
  // await myList.dispose();

  // const forLoop = async () => {
  //   for (let i = 1; i < limitedArrLength; i++) {
  //     const element = await page.waitForSelector(
  //       `#myList > li:nth-child(${i}) > input[type=checkbox]`,
  //       { visible: true }
  //     );
  //     // console.log(element);

  //     await element.click();
  //   }
  // };
  // forLoop();
  // await page.waitForSelector("li[gnb1]", { visible: true });

  //   const context = await page.content();
  //   console.log(context);

  //   await browser.close();
};
