import { SetpEntity, GatewayData, AppEntity } from '../entity-types';
import { util } from '../utils';
import { config } from '../config';

export default <SetpEntity>{
  priority: 10,
  name: 'find-api',
  description: '找到API',
  handler: async (ctx, next) => {
    const gatewayData: GatewayData = ctx.state.$$gateway;
    const { appId } = ctx.params;
    const findApp: AppEntity = config.appMetaDatas[appId];
    if (!findApp) {
      ctx.throw('App meta data not found.');
    }
    const api = findApp.apiHosts[util.random(0, findApp.apiHosts.length - 1)];
    gatewayData.appInfo = findApp;
    const path = ctx.url.slice(6);
    gatewayData.reverseUrl = `${api.protocol}://${api.host}:${api.port}${findApp.apiBase}${path}`;
    await next();
  }
};
