import { SetpEntity, GatewayData } from '../entity-types';
import * as cors from '@koa/cors';

export default <SetpEntity>{
  priority: 15,
  name: 'process-cors',
  description: '处理CORS',
  handler: async (ctx, next) => {
    const gatewayData: GatewayData = ctx.state.$$gateway;
    if (gatewayData.appInfo.enableCors) {
      await cors({ credentials: true })(ctx, next);
    } else {
      await next();
    }
  }
};
