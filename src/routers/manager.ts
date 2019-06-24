import * as KoaRouter from 'koa-router';
const router = new KoaRouter({
  prefix: '/api'
});

router.get('/config', async ctx => {
  ctx.body = 'ok';
});

export { router };
