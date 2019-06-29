import { SetpEntity, GatewayData } from '../entity-types';
import { util } from '../utils';
import { Context } from 'koa';

function recordRequest(gatewayData: GatewayData, ctx: Context) {
  // 保存请求 headers
  gatewayData.reqHeaders = ctx.req.headers;
  // 保存请求体
  let reqBodyBuffer = Buffer.from([]);
  ctx.req
    .on('data', data => {
      reqBodyBuffer = Buffer.concat([reqBodyBuffer, data]);
    })
    .on('end', () => {
      const reqBodyStr = reqBodyBuffer.toString();
      gatewayData.reqBody = reqBodyStr;
    });
}

function appendTraceInfo(gatewayData: GatewayData, ctx: Context) {
  // 追加单次请求详细信息
  const requestId = util.uuidV4();
  const spanId = util.uuidV4().slice(0, 8);
  gatewayData.requestId = requestId;
  gatewayData.requestSpanId = spanId;
  ctx.req.headers['x-request-id'] = requestId;
  ctx.req.headers['x-span-id'] = spanId;
}

function saveRequestToDB(gatewayData: GatewayData) {
  const endTime = process.uptime() * 1000;
  const ms = endTime - gatewayData.startUptime;
  console.log('总开销', ms, gatewayData);
}

export default <SetpEntity>{
  priority: 0,
  name: 'log-request',
  description: '请求日志记录',
  handler: async (ctx, next) => {
    const gatewayData = (ctx.state.$$gateway = <GatewayData>{
      startUptime: process.uptime() * 1000
    });
    // 增加跟踪信息
    appendTraceInfo(gatewayData, ctx);
    // 记录请求
    recordRequest(gatewayData, ctx);
    await next();
    try {
      saveRequestToDB(gatewayData);
    } catch (err) {
      // 利用docker部署，直接输出
      console.error(err);
    }
  }
};
