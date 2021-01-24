import * as dotenv from "dotenv";
const dirs = __dirname.split("/");
dirs.pop();
const rootDir = dirs.join("/");
dotenv.config({ path: rootDir + "/.env" });

import * as koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";
import * as puppeteer from "puppeteer";

import { buyLottery, getUserInformation, signIn } from "./crawling";

const app = new koa();
const router = new Router();
app.use(bodyParser());

router.post("/test", async (ctx, next) => {
  console.log(`${ctx.method} ${ctx.url}`);
  console.log(`${JSON.stringify(ctx.request.body)}`);
  const { id, pwd, waysToBuy } = ctx.request.body;

  const browser = await puppeteer.launch({ headless: false }); // default is true
  const loginResult = await signIn({ id, pwd, browser });
  await buyLottery(loginResult, waysToBuy);
  ctx.body = "Test";
  await next();
});

router.get("/lotteryer", async (ctx, next) => {
  const { id, pwd } = ctx.request.query;

  const browser = await puppeteer.launch({ headless: false }); // default is true
  const loginResult = await signIn({ id, pwd, browser });
  const result = await getUserInformation(loginResult);
  browser.close();
  ctx.body = result;
  await next();
});

app.use(router.routes());

app.listen(3000, () => {
  console.log(`Server up`);
});
