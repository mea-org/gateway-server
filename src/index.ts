import * as Koa from 'koa';
import { router as managerRouter } from './routers/manager';
import { router as gatewayRouter } from './routers/gateway';

const app = new Koa();

app.use(managerRouter.routes());
app.use(gatewayRouter.routes());

app.use(async ctx => {
  ctx.body = 'Gateway server.';
});

app
  .listen(9000, () => {
    console.info('Started...');
  })
  .on('error', err => {
    console.error(err);
  });
