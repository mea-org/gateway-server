import * as KoaRouter from 'koa-router';
import * as koaBody from 'koa-body';
import { config } from '../config';
import { managerBiz } from '../bizs';

const router = new KoaRouter({
  prefix: '/api'
});

// 处理 body
router.use(koaBody());

router
  // 更新 App 元数据
  .put('/app-meta', async ctx => {
    const { body } = ctx.request;
    config.setAppMetaDatas(body);
    ctx.body = 'ok';
  })
  // 查询 App 的请求记录
  .get('/apps/:appId/reqlogs', managerBiz.queryAppRequestLogs)
  // 查询单条请求日志明细
  .get('/apps/:appId/reqlogs/:requestId', managerBiz.queryRequestLogDetail);

export { router };
