import { Context } from 'koa';
import { dbUtil, bizUtil } from '../common';

class ManagerBiz {
  queryAppRequestLogs = async (ctx: Context) => {
    const { appId } = ctx.params;
    const { date } = ctx.query;
    const collectionName = bizUtil.getCollectionName(appId);
    const dateRange = bizUtil.getRangeFromDate(date);
    const filter = {
      startTime: { $gt: dateRange.dayStart, $lt: dateRange.dayEnd }
    };
    const queryOptions = {
      projection: {
        reverseUrl: true,
        startTime: true,
        responseTime: true,
        statusCode: true,
        requestId: true
      },
      sort: { startTime: -1 }, // 根据 startTime 逆序
      ...bizUtil.buildPagingOptions(ctx.query)
    };
    const results = await Promise.all([
      dbUtil.countDocuments(collectionName, filter),
      dbUtil.find(collectionName, filter, queryOptions)
    ]);
    ctx.body = {
      total: results[0],
      rows: results[1]
    };
  };
  queryRequestLogDetail = async (ctx: Context) => {
    const { appId, requestId } = ctx.params;
    const collectionName = bizUtil.getCollectionName(appId);
    const reqlogInfo = await dbUtil.findOne(collectionName, { requestId });
    ctx.body = reqlogInfo;
  };
}

export const managerBiz = new ManagerBiz();
