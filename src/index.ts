import * as dotenv from "dotenv";
const dirs = __dirname.split("/");
dirs.pop();
const rootDir = dirs.join("/");
dotenv.config({ path: rootDir + "/.env" });

import * as koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";
import { crawlingStart } from "./crawling";

const app = new koa();
const router = new Router();
app.use(bodyParser());

router.post("/test", async (ctx, next) => {
  if ("/test" === ctx.path && ctx.method === "POST") {
    console.log(`${ctx.method} ${ctx.url} ${JSON.stringify(ctx.body)}`);
    console.log(`${JSON.stringify(ctx.request.body)}`);
    const { id, pwd, waysToBuy } = ctx.request.body;
    ctx.body = "Test";
    crawlingStart(id, pwd, waysToBuy);
  } else {
    await next();
  }
});

app.use(router.routes());

app.listen(3000, () => {
  console.log(`Server up`);
});
