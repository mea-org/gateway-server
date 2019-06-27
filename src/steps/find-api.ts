import { SetpEntity, GatewayData, AppEntity } from '../entity-types';
import { util } from '../utils';

import { demoData } from '../config/demoData';

export default <SetpEntity>{
  priority: 5,
  name: 'find-api',
  description: '找到API',
  handler: async (ctx, next) => {
    const gatewayData: GatewayData = ctx.state.$$gateway;
    const { appId } = ctx.params;
    const findApp: AppEntity = demoData[appId];
    if (!findApp) {
      ctx.throw('App未找到');
    }
    const api = findApp.apiHosts[util.random(0, findApp.apiHosts.length - 1)];
    gatewayData.appInfo = findApp;
    const path = ctx.url.slice(6);
    gatewayData.reverseUrl = `${api.protocol}://${api.host}:${api.port}${findApp.apiBase}${path}`;
    await next();
  }
};
