import { SetpEntity, GatewayData } from '../entity-types';

export default <SetpEntity>{
  priority: 0,
  name: 'log-request',
  description: '请求日志记录',
  handler: async (ctx, next) => {
    ctx.state.$$gateway = <GatewayData>{
      startUptime: process.uptime() * 1000
    };
    await next();
    const endTime = process.uptime() * 1000;
    const gatewayData: GatewayData = ctx.state.$$gateway;
    console.log('总开销', endTime - gatewayData.startUptime, Object.keys(gatewayData));
  }
};
