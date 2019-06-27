import * as request from 'request';
import * as zlib from 'zlib';

import { config } from '../config';
import { dbUtil } from '../common';

import { SetpEntity, GatewayData } from '../entity-types';
import * as http from 'http';

// const agent = new http.Agent({ keepAlive: true, maxSockets: 20, maxFreeSockets: 10 });

export default <SetpEntity>{
  priority: 25,
  name: 'reverse',
  description: 'Reverse request to real address.',
  handler: async (ctx, next) => {
    const gatewayData: GatewayData = ctx.state.$$gateway;
    // 手动处理请求
    ctx.respond = false;
    // Pipe request
    const requestOpt: any = {
      method: ctx.method,
      url: gatewayData.reverseUrl,
      timeout: config.reverseTimeout
    };
    const req = ctx.req.pipe(
      request(requestOpt),
      { end: true }
    );
    req.pipe(ctx.res);
    return new Promise((resolve, reject) => {
      // Record response
      let resBuffer = Buffer.from([]);
      req
        .on('response', (res: any) => {
          ctx.state.$$gateway.resStatusCode = res.statusCode;
          ctx.state.$$gateway.resHeaders = res.headers;
        })
        .on('data', (data: Buffer) => {
          resBuffer = Buffer.concat([resBuffer, data]);
        })
        .on('end', () => {
          const encoding = ctx.state.$$gateway.resHeaders['content-encoding'] || '';
          // 如果是gzip，需要解压
          if (encoding === 'gzip') {
            resBuffer = zlib.unzipSync(resBuffer);
          }
          const bodyStr = resBuffer.toString();
          gatewayData.resBody = bodyStr;
          resolve();
        })
        .on('error', (err: any) => {
          reject(err);
        });
    });
  }
};
