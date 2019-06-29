import * as Koa from 'koa';
import { router as managerRouter } from './routers/manager';
import { router as gatewayRouter } from './routers/gateway';
import { config } from './config';
import { testData } from './config/testData';

const app = new Koa();

app.use(managerRouter.routes());
app.use(gatewayRouter.routes());

app.use(async ctx => {
  ctx.body = 'Gateway server.';
});
if (process.env.NODE_ENV === 'development') {
  config.setAppMetaDatas(testData);
}

const server = app
  .listen(9000, () => {
    const addr = server.address();
    console.info('Started...', addr);
  })
  .on('error', err => {
    console.error(err);
  });
