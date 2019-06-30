import { Context } from 'koa';
import { SetpEntity, GatewayData, ReqlogsEntity } from '../entity-types';
import { util } from '../utils';
import { dbUtil, bizUtil } from '../common';

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
  const responseTime = endTime - gatewayData.startUptime;
  const collectionName = bizUtil.getCollectionName(gatewayData.appInfo.appId);
  const reqLog: ReqlogsEntity = {
    startTime: gatewayData.startTime,
    responseTime,
    statusCode: gatewayData.resStatusCode,
    requestId: gatewayData.requestId,
    requestSpanId: gatewayData.requestSpanId,
    requestParentSpanId: gatewayData.requestParentSpanId || '',
    reqHeaders: gatewayData.reqHeaders,
    reqBody: gatewayData.reqBody,
    resHeaders: gatewayData.resHeaders,
    resBody: gatewayData.resBody,
    reverseUrl: gatewayData.reverseUrl
  };
  dbUtil.insertOne(collectionName, reqLog).catch(err => {
    console.error('save request log to db failed,', reqLog);
  });
}

export default <SetpEntity>{
  priority: 0,
  name: 'log-request',
  description: '记录单次请求日志',
  handler: async (ctx, next) => {
    const gatewayData = (ctx.state.$$gateway = <GatewayData>{
      startTime: Date.now(),
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
