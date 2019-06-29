import * as request from 'request';
import * as zlib from 'zlib';

import { config } from '../config';
import { util } from '../utils';

import { SetpEntity, GatewayData } from '../entity-types';

// const agent = new http.Agent({ keepAlive: true, maxSockets: 20, maxFreeSockets: 10 });

export default <SetpEntity>{
  priority: 20,
  name: 'reverse',
  description: 'Reverse request to real address.',
  handler: async (ctx, next) => {
    const gatewayData: GatewayData = ctx.state.$$gateway;
    // 设置手动处理请求
    ctx.respond = false;
    // 利用管道联通
    const reqOpt: any = {
      method: ctx.method,
      url: gatewayData.reverseUrl,
      timeout: config.reverseTimeout
    };
    const reverseReq = ctx.req.pipe(
      request(reqOpt),
      { end: true }
    );
    reverseReq.pipe(ctx.res);
    // 记录响应
    return new Promise((resolve, reject) => {
      // Record response
      let resBodyBuffer = Buffer.from([]);
      reverseReq
        .on('response', (res: any) => {
          gatewayData.resStatusCode = res.statusCode;
          gatewayData.resHeaders = res.headers;
        })
        .on('data', (data: Buffer) => {
          resBodyBuffer = Buffer.concat([resBodyBuffer, data]);
        })
        .on('end', () => {
          const encoding = gatewayData.resHeaders['content-encoding'] || '';
          // 如果是gzip，需要解压
          if (encoding === 'gzip') {
            resBodyBuffer = zlib.unzipSync(resBodyBuffer);
          }
          const resBodyStr = resBodyBuffer.toString();
          gatewayData.resBody = resBodyStr;
          resolve();
        })
        .on('error', (err: any) => {
          const errStr = util.safeJSONParse(err, '[[gateway-server]]parse obj error.');
          ctx.res.end(errStr);
          gatewayData.resBody = errStr;
          reject(err);
        });
    });
  }
};
