const Koa = require('koa');
const app = new Koa();

const Chat = require('./chat');

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const chat = new Chat();

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await chat.subscribe(ctx);
});

router.post('/publish', async (ctx, next) => {
  chat.publish(ctx);
  ctx.body = '';
});

app.use(router.routes());

module.exports = app;
