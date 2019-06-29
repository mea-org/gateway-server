import * as KoaRouter from 'koa-router';
import * as koaBody from 'koa-body';
import { config } from '../config';

const router = new KoaRouter({
  prefix: '/api'
});

// 处理 body
router.use(koaBody());

router.put('/app-meta', async ctx => {
  const { body } = ctx.request;
  config.setAppMetaDatas(body);
  ctx.body = 'ok';
});

export { router };
